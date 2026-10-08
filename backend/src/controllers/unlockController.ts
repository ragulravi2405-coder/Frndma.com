import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ContactUnlock } from '../models/ContactUnlock';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { UserContactCredits } from '../models/UserContactCredits';
import { resolveTargetProfile } from './paymentController';

export const getMyUnlockedContacts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    if (!currentUserId) {
      res.status(200).json({
        success: true,
        data: [],
      });
      return;
    }

    const unlocks = await ContactUnlock.find({
      userId: currentUserId,
      status: 'unlocked',
    }).sort({ unlockedAt: -1 });

    const results = await Promise.all(
      unlocks.map(async (u) => {
        const ownerUser = await User.findById(u.profileOwnerId).select('username mobileNumber');
        const ownerProfile = await Profile.findOne({ userId: u.profileOwnerId });

        if (!ownerUser) return null;

        return {
          id: u._id,
          profileOwnerId: u.profileOwnerId,
          username: ownerUser.username,
          displayName: ownerProfile?.displayName,
          avatarUrl: ownerProfile?.avatarUrl,
          city: ownerProfile?.city,
          contactSharing: ownerProfile?.contactSharing,
          contactNumber: ownerProfile?.contactSharing
            ? ownerProfile.shareableContact || ownerUser.mobileNumber
            : 'Contact Sharing Disabled by Owner',
          unlockedAt: u.unlockedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: results.filter(Boolean),
    });
  } catch (error) {
    next(error);
  }
};

export const checkUnlockStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { targetUserId } = req.params;

    if (!currentUserId) {
      res.status(200).json({
        success: true,
        data: {
          isUnlocked: false,
          contactSharingEnabled: false,
        },
      });
      return;
    }

    const unlock = await ContactUnlock.findOne({
      userId: currentUserId,
      profileOwnerId: targetUserId,
      status: 'unlocked',
    });

    const targetProfile = await Profile.findOne({ userId: targetUserId });

    res.status(200).json({
      success: true,
      data: {
        isUnlocked: !!unlock,
        contactSharingEnabled: targetProfile?.contactSharing || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCredits = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    if (!currentUserId) {
      res.status(200).json({
        success: true,
        data: { totalCredits: 0, usedCredits: 0, remainingCredits: 0 },
      });
      return;
    }

    const credits = await UserContactCredits.findOne({ userId: currentUserId });
    res.status(200).json({
      success: true,
      data: {
        totalCredits: credits?.totalCredits || 0,
        usedCredits: credits?.usedCredits || 0,
        remainingCredits: credits?.remainingCredits || 0,
        lastPurchasedAt: credits?.lastPurchasedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const useCreditToUnlock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { targetProfileId } = req.body;

    if (!currentUserId) {
      res.status(401).json({ success: false, message: 'Please log in to unlock contacts.' });
      return;
    }

    if (!targetProfileId) {
      res.status(400).json({ success: false, message: 'Target profile ID is required.' });
      return;
    }

    // 1. Check user credit balance authoritative from database
    const credits = await UserContactCredits.findOne({ userId: currentUserId });
    if (!credits || credits.remainingCredits <= 0) {
      res.status(400).json({
        success: false,
        message: 'No contact unlock credits remaining. Please purchase the ₹999 offer to unlock more contacts.',
      });
      return;
    }

    // 2. Resolve target profile
    const { targetProfile, targetUser } = await resolveTargetProfile(targetProfileId);
    if (!targetProfile || !targetProfile.userId) {
      res.status(404).json({ success: false, message: 'Target profile not found.' });
      return;
    }

    const profileOwnerId = targetProfile.userId.toString();

    // 3. Check if already unlocked
    const existingUnlock = await ContactUnlock.findOne({
      userId: currentUserId,
      profileOwnerId,
      status: 'unlocked',
    });

    if (existingUnlock) {
      res.status(200).json({
        success: true,
        alreadyUnlocked: true,
        message: 'You have already unlocked this contact!',
        data: {
          remainingCredits: credits.remainingCredits,
          contactDetails: {
            ownerUsername: targetUser?.username,
            displayName: targetProfile?.displayName,
            contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
            contactSharing: true,
          },
        },
      });
      return;
    }

    // 4. Create ContactUnlock record
    await ContactUnlock.create({
      userId: currentUserId,
      profileOwnerId,
      paymentId: `credit_unlock_${Date.now()}`,
      orderId: `ord_credit_${Date.now()}`,
      status: 'unlocked',
      unlockedAt: new Date(),
    });

    // 5. Deduct 1 credit atomically
    credits.usedCredits += 1;
    credits.remainingCredits = Math.max(0, credits.totalCredits - credits.usedCredits);
    credits.history.push({
      action: 'used',
      amount: 1,
      profileOwnerId: targetProfile.userId,
      timestamp: new Date(),
      notes: `Unlocked contact for ${targetProfile.displayName}`,
    });
    await credits.save();

    res.status(200).json({
      success: true,
      message: `Contact for ${targetProfile.displayName} unlocked successfully using 1 credit!`,
      data: {
        remainingCredits: credits.remainingCredits,
        usedCredits: credits.usedCredits,
        totalCredits: credits.totalCredits,
        contactDetails: {
          ownerUsername: targetUser?.username,
          displayName: targetProfile?.displayName,
          contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
          contactSharing: true,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

