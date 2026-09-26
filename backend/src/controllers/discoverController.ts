import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { Like } from '../models/Like';
import { BlockedUser } from '../models/BlockedUser';

export const getDiscoverProfiles = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      minAge = 18,
      maxAge = 100,
      gender,
      city,
      interest,
      relationshipPreference,
      limit = 20,
      page = 1,
    } = req.query;

    const currentUserId = req.userId;

    // Get blocked users
    const blockedRecords = currentUserId
      ? await BlockedUser.find({
          $or: [{ userId: currentUserId }, { blockedUserId: currentUserId }],
        })
      : [];

    const blockedUserIds = blockedRecords.map((b) =>
      b.userId.toString() === currentUserId ? b.blockedUserId : b.userId
    );

    // Get liked users to optionally exclude or prioritize
    const likedRecords = currentUserId
      ? await Like.find({ fromUserId: currentUserId })
      : [];
    const likedUserIds = likedRecords.map((l) => l.toUserId);

    const excludeUserIds = [
      ...(currentUserId ? [currentUserId] : []),
      ...blockedUserIds,
      ...likedUserIds,
    ];

    // Build query
    const profileQuery: any = {
      userId: { $nin: excludeUserIds },
      age: { $gte: Number(minAge), $lte: Number(maxAge) },
    };

    if (gender && gender !== 'all') {
      profileQuery.gender = gender;
    }

    if (city && typeof city === 'string' && city.trim() !== '') {
      profileQuery.city = { $regex: new RegExp(city.trim(), 'i') };
    }

    if (interest && typeof interest === 'string' && interest.trim() !== '') {
      profileQuery.interests = { $in: [new RegExp(interest.trim(), 'i')] };
    }

    if (relationshipPreference && typeof relationshipPreference === 'string') {
      profileQuery.relationshipPreference = relationshipPreference;
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Find profiles and populate user fields
    const profiles = await Profile.find(profileQuery)
      .populate('userId', 'username isOnline lastActive isBanned isSuspended')
      .skip(skip)
      .limit(Number(limit))
      .sort({ updatedAt: -1 });

    // Filter out banned/suspended users
    const validProfiles = profiles
      .filter((p: any) => p.userId && !p.userId.isBanned && !p.userId.isSuspended)
      .map((p: any) => ({
        id: p._id,
        userId: p.userId._id,
        username: p.userId.username,
        displayName: p.displayName,
        age: p.age,
        gender: p.gender,
        city: p.city,
        state: p.state,
        bio: p.bio,
        interests: p.interests,
        occupation: p.occupation,
        relationshipPreference: p.relationshipPreference,
        avatarUrl: p.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
        photos: p.photos,
        isOnline: p.userId.isOnline,
        contactSharing: p.contactSharing,
        unlockPrice: p.unlockPrice || 399,
      }));

    res.status(200).json({
      success: true,
      data: validProfiles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: validProfiles.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
