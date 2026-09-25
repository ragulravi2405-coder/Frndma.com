import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ContactUnlock } from '../models/ContactUnlock';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

export const getMyUnlockedContacts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;

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
