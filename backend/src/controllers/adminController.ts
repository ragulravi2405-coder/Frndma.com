import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { Admin } from '../models/Admin';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Match } from '../models/Match';
import { Message } from '../models/Message';
import { Payment } from '../models/Payment';
import { ContactUnlock } from '../models/ContactUnlock';
import { Report } from '../models/Report';
import { BlockedUser } from '../models/BlockedUser';
import { Plan } from '../models/Plan';
import { FAQ } from '../models/FAQ';
import { Subscription } from '../models/Subscription';

import { GIRLS_PROFILES_LIST } from '../config/girlsProfiles';

export const adminLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password } = req.body;
    const cleanUser = (username || '').trim().toLowerCase();

    // Check if initial admin exists, if not seed from ENV
    let admin = await Admin.findOne({
      username: { $in: [cleanUser, ENV.ADMIN_USERNAME.toLowerCase()] },
    }).select('+password');

    if (!admin && (cleanUser === ENV.ADMIN_USERNAME.toLowerCase() || cleanUser === 'rahul2005')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);
      admin = await Admin.create({
        username: ENV.ADMIN_USERNAME.toLowerCase(),
        password: hashedPassword,
        role: 'superadmin',
      });
    }

    if (!admin || !admin.password) {
      res.status(401).json({ success: false, message: 'Invalid administrative credentials' });
      return;
    }

    const isMatch = (await bcrypt.compare(password, admin.password)) || (password === ENV.ADMIN_PASSWORD);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid administrative credentials' });
      return;
    }

    if (password === ENV.ADMIN_PASSWORD && !(await bcrypt.compare(password, admin.password))) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { adminId: admin._id, role: admin.role, username: admin.username },
      ENV.JWT_SECRET,
      { expiresIn: '2d' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: 'Admin authorization successful',
      data: {
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const adminLogout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Admin session terminated successfully.',
  });
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', isBanned: false, isSuspended: false });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const suspendedUsers = await User.countDocuments({ isSuspended: true });
    const matchesCount = await Match.countDocuments();
    const messagesCount = await Message.countDocuments();
    const contactUnlocksCount = await ContactUnlock.countDocuments();
    const reportsCount = await Report.countDocuments({ status: 'pending' });
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });

    const payments = await Payment.find({ status: 'captured' });
    const totalRevenue = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        bannedUsers,
        suspendedUsers,
        matchesCount,
        messagesCount,
        contactUnlocksCount,
        reportsCount,
        activeSubscriptions,
        totalRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;

    const query: any = { role: 'user' };

    if (search) {
      query.$or = [
        { username: { $regex: String(search), $options: 'i' } },
        { mobileNumber: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (status === 'banned') query.isBanned = true;
    if (status === 'suspended') query.isSuspended = true;
    if (status === 'active') {
      query.isBanned = false;
      query.isSuspended = false;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);

    const userIds = users.map((u) => u._id);
    const profiles = await Profile.find({ userId: { $in: userIds } });
    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const result = users.map((u) => {
      const p = profileMap.get(u._id.toString());
      return {
        id: u._id,
        username: u.username,
        mobileNumber: u.mobileNumber,
        isBanned: u.isBanned,
        isSuspended: u.isSuspended,
        isAgeConfirmed: u.isAgeConfirmed,
        createdAt: u.createdAt,
        displayName: p?.displayName || 'N/A',
        city: p?.city || 'N/A',
        age: p?.age || 'N/A',
        contactSharing: p?.contactSharing || false,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const { action } = req.body; // 'ban' | 'unban' | 'suspend' | 'unsuspend' | 'delete'

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (action === 'ban') user.isBanned = true;
    if (action === 'unban') user.isBanned = false;
    if (action === 'suspend') user.isSuspended = true;
    if (action === 'unsuspend') user.isSuspended = false;

    if (action === 'delete') {
      await User.findByIdAndDelete(userId);
      await Profile.findOneAndDelete({ userId });
      res.status(200).json({ success: true, message: 'User and profile permanently deleted' });
      return;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `User status updated: ${action}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'username')
      .populate('reportedUser', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { $set: { status, adminNotes } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Report status updated',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'username mobileNumber')
      .populate('targetProfileId', 'username')
      .populate('planId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plans = await Plan.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

export const saveAdminPlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, name, price, interval, description, features, isPopular, isActive, order } = req.body;

    let plan;
    if (id) {
      plan = await Plan.findByIdAndUpdate(
        id,
        { name, price, interval, description, features, isPopular, isActive, order },
        { new: true }
      );
    } else {
      plan = await Plan.create({
        name,
        price,
        interval,
        description,
        features,
        isPopular,
        isActive,
        order,
      });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// ============================================================================
// 🌸 GIRLS PROFILES & CONTACT MANAGEMENT (ADMIN EXCLUSIVE) 🌸
// ============================================================================

// GET /api/admin/girls
export const getAdminGirls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profiles = await Profile.find({ gender: 'female' })
      .populate('userId', 'username mobileNumber isOnline isBanned isSuspended createdAt')
      .sort({ updatedAt: -1 });

    const girls = profiles.map((p: any) => ({
      id: p._id,
      userId: p.userId?._id,
      username: p.userId?.username || 'user',
      displayName: p.displayName,
      age: p.age,
      city: p.city,
      state: p.state || 'Tamil Nadu',
      bio: p.bio || '',
      occupation: p.occupation || '',
      education: p.education || '',
      languages: p.languages || [],
      interests: p.interests || [],
      avatarUrl: p.avatarUrl,
      photos: p.photos || [],
      shareableContact: p.shareableContact || p.userId?.mobileNumber || '',
      contactSharing: p.contactSharing !== false,
      isOnline: p.userId?.isOnline || false,
      isBanned: p.userId?.isBanned || false,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    res.status(200).json({ success: true, data: girls });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/girls
export const createAdminGirl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      displayName,
      age,
      city,
      state,
      bio,
      occupation,
      education,
      languages,
      interests,
      avatarUrl,
      shareableContact,
      username,
    } = req.body;

    if (!displayName || !age || !city || !avatarUrl) {
      res.status(400).json({
        success: false,
        message: 'Name, age, city, and image URL are required.',
      });
      return;
    }

    const baseUsername = (username || `${displayName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.floor(1000 + Math.random() * 9000)}`).toLowerCase();
    
    let finalUsername = baseUsername;
    let existing = await User.findOne({ username: finalUsername });
    let counter = 1;
    while (existing) {
      finalUsername = `${baseUsername}_${counter}`;
      existing = await User.findOne({ username: finalUsername });
      counter++;
    }

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Frndma@2026', salt);
    const contact = (shareableContact || '').trim() || `98765${Math.floor(10000 + Math.random() * 90000)}`;

    const user = await User.create({
      username: finalUsername,
      mobileNumber: contact,
      password: defaultPassword,
      isAgeConfirmed: true,
      role: 'user',
      isOnline: true,
    });

    const parsedInterests = Array.isArray(interests)
      ? interests
      : typeof interests === 'string'
      ? interests.split(',').map((s) => s.trim()).filter(Boolean)
      : ['Music', 'Travel'];

    const parsedLanguages = Array.isArray(languages)
      ? languages
      : typeof languages === 'string'
      ? languages.split(',').map((s) => s.trim()).filter(Boolean)
      : ['English', 'Tamil'];

    const profile = await Profile.create({
      userId: user._id,
      displayName,
      age: Number(age) || 20,
      gender: 'female',
      city,
      state: state || 'Tamil Nadu',
      bio: bio || '',
      occupation: occupation || 'Professional',
      education: education || 'Graduate',
      languages: parsedLanguages,
      interests: parsedInterests,
      avatarUrl,
      photos: [{ url: avatarUrl, publicId: `girl_${user._id}`, isPrimary: true }],
      contactSharing: true,
      shareableContact: contact,
      isProfileComplete: true,
    });

    res.status(201).json({
      success: true,
      message: 'Girl profile added successfully!',
      data: {
        id: profile._id,
        userId: user._id,
        username: user.username,
        displayName: profile.displayName,
        avatarUrl: profile.avatarUrl,
        shareableContact: profile.shareableContact,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/girls/:id
export const updateAdminGirl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      displayName,
      age,
      city,
      state,
      bio,
      occupation,
      education,
      languages,
      interests,
      avatarUrl,
      shareableContact,
    } = req.body;

    const profile = await Profile.findById(id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    if (displayName) profile.displayName = displayName;
    if (age) profile.age = Number(age);
    if (city) profile.city = city;
    if (state !== undefined) profile.state = state;
    if (bio !== undefined) profile.bio = bio;
    if (occupation !== undefined) profile.occupation = occupation;
    if (education !== undefined) profile.education = education;
    if (avatarUrl) {
      profile.avatarUrl = avatarUrl;
      profile.photos = [{ url: avatarUrl, publicId: `girl_${profile.userId}`, isPrimary: true }];
    }
    if (shareableContact) {
      profile.shareableContact = shareableContact;
      await User.findByIdAndUpdate(profile.userId, { mobileNumber: shareableContact });
    }
    if (interests) {
      profile.interests = Array.isArray(interests)
        ? interests
        : interests.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (languages) {
      profile.languages = Array.isArray(languages)
        ? languages
        : languages.split(',').map((s: string) => s.trim()).filter(Boolean);
    }

    profile.contactSharing = true;
    profile.isProfileComplete = true;
    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/girls/:id
export const deleteAdminGirl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    await User.findByIdAndDelete(profile.userId);
    await Profile.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/girls/sync-code
export const syncDefaultGirls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('Frndma@2026', salt);

    let syncedCount = 0;
    for (const g of GIRLS_PROFILES_LIST) {
      let user = await User.findOne({ username: g.username });
      if (!user) {
        user = await User.create({
          username: g.username,
          mobileNumber: g.shareableContact || `98765${Math.floor(10000 + Math.random() * 90000)}`,
          password: defaultPassword,
          isAgeConfirmed: true,
          role: 'user',
          isOnline: true,
        });
      }

      await Profile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          displayName: g.displayName,
          age: g.age,
          gender: 'female',
          city: g.city,
          state: g.state || 'Tamil Nadu',
          bio: g.bio,
          interests: g.interests || ['Music', 'Travel'],
          occupation: g.occupation || 'Professional',
          education: g.education || 'Graduate',
          languages: g.languages || ['English', 'Tamil'],
          avatarUrl: g.avatarUrl,
          photos: [{ url: g.avatarUrl, publicId: `seed_${g.username}`, isPrimary: true }],
          contactSharing: true,
          shareableContact: g.shareableContact,
          isProfileComplete: true,
        },
        { upsert: true, new: true }
      );
      syncedCount++;
    }

    res.status(200).json({
      success: true,
      message: `Successfully synced ${syncedCount} profiles from code (girlsProfiles.ts)!`,
      count: syncedCount,
    });
  } catch (error) {
    next(error);
  }
};
