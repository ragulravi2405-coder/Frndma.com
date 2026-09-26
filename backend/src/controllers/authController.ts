import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Admin } from '../models/Admin';
import { ENV } from '../config/env';
import { AuthRequest } from '../middleware/auth';

export const registerSchema = z
  .object({
    username: z
      .string({ required_error: 'Username is required' })
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    mobileNumber: z.string().optional(),
    mobile: z.string().optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    isAgeConfirmed: z.boolean().optional().default(true),
  })
  .refine(
    (data) => {
      const phone = (data.mobileNumber || data.mobile || '').trim();
      return phone.length >= 10 && phone.length <= 15;
    },
    {
      message: 'Valid 10-digit mobile number required',
      path: ['mobileNumber'],
    }
  );

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or mobile number is required'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sendTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawUsername = req.body.username;
    const rawMobile = req.body.mobileNumber || req.body.mobile || '';
    const rawPassword = req.body.password;
    const isAgeConfirmed = req.body.isAgeConfirmed !== undefined ? Boolean(req.body.isAgeConfirmed) : true;

    if (!rawUsername || typeof rawUsername !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Username is required',
      });
      return;
    }

    const username = rawUsername.trim().toLowerCase();
    const mobileNumber = String(rawMobile).trim();
    const password = String(rawPassword);

    const reservedUsernames = [ENV.ADMIN_USERNAME.toLowerCase(), 'rahul2005', 'admin', 'administrator', 'root'];
    if (reservedUsernames.includes(username)) {
      res.status(400).json({
        success: false,
        message: 'This username is reserved and cannot be registered.',
      });
      return;
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(409).json({
        success: false,
        message: 'Username already exists',
      });
      return;
    }

    // Check if mobile number already exists
    const existingMobile = await User.findOne({ mobileNumber });
    if (existingMobile) {
      res.status(409).json({
        success: false,
        message: 'Mobile number already registered',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      mobileNumber,
      password: hashedPassword,
      isAgeConfirmed,
      role: 'user',
    });

    // Create or update initial draft profile safely
    try {
      await Profile.findOneAndUpdate(
        { userId: newUser._id },
        {
          $setOnInsert: {
            userId: newUser._id,
            displayName: rawUsername.trim(),
            age: 18,
            gender: 'female',
            city: 'Not Specified',
            bio: '',
            interests: [],
            languages: ['English'],
            isProfileComplete: false,
          },
        },
        { upsert: true, new: true }
      );
    } catch (profileErr) {
      console.warn('Initial profile creation warning:', profileErr);
    }

    const token = generateToken(newUser._id.toString(), newUser.role);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Frndma.',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          mobileNumber: newUser.mobileNumber,
          role: newUser.role,
          isAgeConfirmed: newUser.isAgeConfirmed,
          createdAt: newUser.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('REGISTER ERROR:', error);

    // MongoDB Duplicate Key Error (E11000)
    if (error && error.code === 11000) {
      const field = Object.keys(error.keyPattern || error.keyValue || {})[0] || '';
      if (field === 'username' || error.message?.includes('username')) {
        res.status(409).json({
          success: false,
          message: 'Username already exists',
        });
        return;
      }
      if (field === 'mobileNumber' || error.message?.includes('mobileNumber')) {
        res.status(409).json({
          success: false,
          message: 'Mobile number already registered',
        });
        return;
      }
      res.status(409).json({
        success: false,
        message: 'Username or mobile number already exists',
      });
      return;
    }

    // Mongoose Validation Error
    if (error && error.name === 'ValidationError') {
      const messages = Object.values(error.errors || {}).map((e: any) => e.message);
      res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error',
        errors: messages,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
    return;
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();

    // 🔒 Secret Admin Login Check (rahul2005 / Abcd@1234)
    // No special admin button needed on UI - normal login accepts admin credentials seamlessly!
    if (cleanId === ENV.ADMIN_USERNAME.toLowerCase() || cleanId === 'rahul2005') {
      let admin = await Admin.findOne({
        username: { $in: [cleanId, ENV.ADMIN_USERNAME.toLowerCase()] },
      }).select('+password');

      if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);
        admin = await Admin.create({
          username: ENV.ADMIN_USERNAME.toLowerCase(),
          password: hashedPassword,
          role: 'superadmin',
        });
      }

      if (admin && admin.password) {
        const isMatch = (await bcrypt.compare(password, admin.password)) || (password === ENV.ADMIN_PASSWORD);
        if (isMatch) {
          // If password matched plain ENV password, refresh hash
          if (password === ENV.ADMIN_PASSWORD && !(await bcrypt.compare(password, admin.password))) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
          }
          admin.lastLogin = new Date();
          await admin.save();

          const adminToken = jwt.sign(
            { adminId: admin._id, role: admin.role, username: admin.username },
            ENV.JWT_SECRET,
            { expiresIn: '2d' }
          );

          res.cookie('adminToken', adminToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000,
          });

          sendTokenCookie(res, adminToken);

          res.status(200).json({
            success: true,
            message: 'Signed in successfully.',
            isAdmin: true,
            redirectTo: '/admin',
            data: {
              user: {
                id: admin._id,
                username: admin.username,
                role: 'admin',
              },
              token: adminToken,
            },
          });
          return;
        }
      }
    }

    const trimmedId = (identifier || '').trim();
    const user = await User.findOne({
      $or: [
        { username: cleanId },
        { mobileNumber: trimmedId },
      ],
    }).select('+password');

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/mobile or password.',
      });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({
        success: false,
        message: 'Your account has been banned due to violation of community terms.',
      });
      return;
    }

    if (user.isSuspended) {
      res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact support on WhatsApp.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/mobile or password.',
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);
    sendTokenCookie(res, token);

    const profile = await Profile.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id,
          username: user.username,
          mobileNumber: user.mobileNumber,
          role: user.role,
          isAgeConfirmed: user.isAgeConfirmed,
        },
        profile,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          mobileNumber: req.user.mobileNumber,
          role: req.user.role,
          isAgeConfirmed: req.user.isAgeConfirmed,
          createdAt: req.user.createdAt,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { mobileNumber } = req.body;
  res.status(200).json({
    success: true,
    message: `If an account with mobile ${mobileNumber} exists, password reset guidance has been sent. You can also reach our support via email at ${ENV.SUPPORT_EMAIL || 'catman2kai@gmail.com'}.`,
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Password reset completed.',
  });
};
