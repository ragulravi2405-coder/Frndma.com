import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { ContactUnlock } from '../models/ContactUnlock';
import { BlockedUser } from '../models/BlockedUser';
import cloudinary from '../config/cloudinary';

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      displayName,
      age,
      gender,
      city,
      state,
      bio,
      interests,
      occupation,
      education,
      languages,
      relationshipPreference,
      contactSharing,
      shareableContact,
      avatarUrl,
    } = req.body;

    if (age !== undefined && age < 18) {
      res.status(400).json({
        success: false,
        message: 'Must be at least 18 years old to use Frndma.',
      });
      return;
    }

    const updated = await Profile.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          ...(displayName && { displayName }),
          ...(age && { age }),
          ...(gender && { gender }),
          ...(city && { city }),
          ...(state !== undefined && { state }),
          ...(bio !== undefined && { bio }),
          ...(interests && { interests }),
          ...(occupation !== undefined && { occupation }),
          ...(education !== undefined && { education }),
          ...(languages && { languages }),
          ...(relationshipPreference !== undefined && { relationshipPreference }),
          ...(contactSharing !== undefined && { contactSharing }),
          ...(shareableContact !== undefined && { shareableContact }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          isProfileComplete: true,
        },
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileByUsername = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username } = req.params;

    const targetUser = await User.findOne({ username: username.toLowerCase() });
    if (!targetUser || targetUser.isBanned) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check if viewer is blocked by target user or has blocked target user
    if (req.userId) {
      const isBlocked = await BlockedUser.findOne({
        $or: [
          { userId: req.userId, blockedUserId: targetUser._id },
          { userId: targetUser._id, blockedUserId: req.userId },
        ],
      });

      if (isBlocked) {
        res.status(404).json({ success: false, message: 'User profile unavailable.' });
        return;
      }
    }

    const profile = await Profile.findOne({ userId: targetUser._id });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile details not found' });
      return;
    }

    const isSelf = req.userId === targetUser._id.toString();
    let isContactUnlocked = false;

    if (!isSelf && req.userId) {
      const unlockRecord = await ContactUnlock.findOne({
        userId: req.userId,
        profileOwnerId: targetUser._id,
        status: 'unlocked',
      });
      if (unlockRecord) {
        isContactUnlocked = true;
      }
    }

    // Prepare safe profile output
    const safeProfile = {
      id: profile._id,
      userId: targetUser._id,
      username: targetUser.username,
      displayName: profile.displayName,
      age: profile.age,
      gender: profile.gender,
      city: profile.city,
      state: profile.state,
      bio: profile.bio,
      interests: profile.interests,
      occupation: profile.occupation,
      education: profile.education,
      languages: profile.languages,
      relationshipPreference: profile.relationshipPreference,
      avatarUrl: profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      photos: profile.photos,
      isOnline: targetUser.isOnline,
      lastActive: targetUser.lastActive,
      contactSharingEnabled: profile.contactSharing,
      isContactUnlocked: isSelf || isContactUnlocked,
      shareableContact:
        isSelf || (isContactUnlocked && profile.contactSharing)
          ? profile.shareableContact || targetUser.mobileNumber
          : null,
      contactMessage:
        isSelf || (isContactUnlocked && profile.contactSharing)
          ? 'Contact information verified and accessible.'
          : profile.contactSharing
          ? 'Contact access is available through Premium Unlock.'
          : 'Profile owner has kept direct contact details private.',
    };

    res.status(200).json({
      success: true,
      data: safeProfile,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadProfilePhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    const { photoUrl } = req.body; // Can accept direct URL or file

    let finalUrl = '';
    let publicId = '';

    if (file) {
      try {
        // Upload to Cloudinary using buffer
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'frndma_profiles',
          transformation: [{ width: 800, height: 800, crop: 'fill', gravity: 'face' }],
        });
        finalUrl = result.secure_url;
        publicId = result.public_id;
      } catch (cloudErr) {
        console.warn('[Cloudinary] Fallback to direct photo url if cloud error:', (cloudErr as Error).message);
        finalUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
        publicId = `local_${Date.now()}`;
      }
    } else if (photoUrl) {
      finalUrl = photoUrl;
      publicId = `ext_${Date.now()}`;
    } else {
      res.status(400).json({ success: false, message: 'Please provide an image file or photoUrl' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const isFirstPhoto = profile.photos.length === 0 || !profile.avatarUrl;

    profile.photos.push({
      url: finalUrl,
      publicId,
      isPrimary: isFirstPhoto,
    });

    if (isFirstPhoto) {
      profile.avatarUrl = finalUrl;
      profile.cloudinaryPublicId = publicId;
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully.',
      data: {
        avatarUrl: profile.avatarUrl,
        photos: profile.photos,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfilePhoto = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { publicId } = req.params;

    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    profile.photos = profile.photos.filter((p) => p.publicId !== publicId);

    if (profile.cloudinaryPublicId === publicId) {
      const nextPhoto = profile.photos[0];
      profile.avatarUrl = nextPhoto ? nextPhoto.url : '';
      profile.cloudinaryPublicId = nextPhoto ? nextPhoto.publicId : '';
    }

    await profile.save();

    res.status(200).json({
      success: true,
      message: 'Photo deleted.',
      data: profile.photos,
    });
  } catch (error) {
    next(error);
  }
};
