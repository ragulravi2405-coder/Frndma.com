import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Like } from '../models/Like';
import { Match } from '../models/Match';
import { Profile } from '../models/Profile';
import { Notification } from '../models/Notification';
import { User } from '../models/User';

export const likeUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fromUserId = req.userId;
    const { targetUserId } = req.body;

    if (!fromUserId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (fromUserId === targetUserId) {
      res.status(400).json({ success: false, message: 'You cannot like your own profile' });
      return;
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser || targetUser.isBanned) {
      res.status(404).json({ success: false, message: 'Target profile not found or inactive' });
      return;
    }

    // Save Like record
    await Like.findOneAndUpdate(
      { fromUserId, toUserId: targetUserId },
      { fromUserId, toUserId: targetUserId },
      { upsert: true, new: true }
    );

    // Check if target user has liked current user (Mutual Match)
    const reciprocalLike = await Like.findOne({
      fromUserId: targetUserId,
      toUserId: fromUserId,
    });

    if (reciprocalLike) {
      // Find or create match
      let match = await Match.findOne({
        users: { $all: [fromUserId, targetUserId] },
      });

      if (!match) {
        match = await Match.create({
          users: [fromUserId, targetUserId],
          active: true,
          lastMessageAt: new Date(),
        });
      }

      // Fetch matched user's profile
      const matchedProfile = await Profile.findOne({ userId: targetUserId });
      const currentProfile = await Profile.findOne({ userId: fromUserId });

      // Notify target user
      await Notification.create({
        recipientId: targetUserId,
        senderId: fromUserId,
        type: 'match',
        title: "It's a Match! ❤️",
        body: `You and ${currentProfile?.displayName || 'someone'} liked each other! Start chatting now.`,
        link: `/messages/${match._id}`,
      });

      res.status(200).json({
        success: true,
        message: "It's a Match! ❤️",
        data: {
          isMatch: true,
          matchId: match._id,
          matchedUser: {
            id: targetUser._id,
            username: targetUser.username,
            displayName: matchedProfile?.displayName,
            avatarUrl: matchedProfile?.avatarUrl,
            city: matchedProfile?.city,
            age: matchedProfile?.age,
          },
        },
      });
      return;
    }

    // Notify target user of like
    const currentProfile = await Profile.findOne({ userId: fromUserId });
    await Notification.create({
      recipientId: targetUserId,
      senderId: fromUserId,
      type: 'like',
      title: 'New Like Received! ❤️',
      body: `${currentProfile?.displayName || 'Someone'} liked your profile.`,
      link: '/likes',
    });

    res.status(200).json({
      success: true,
      message: 'Liked profile successfully.',
      data: { isMatch: false },
    });
  } catch (error) {
    next(error);
  }
};

export const unlikeUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const fromUserId = req.userId;
    const { targetUserId } = req.params;

    await Like.findOneAndDelete({ fromUserId, toUserId: targetUserId });

    res.status(200).json({
      success: true,
      message: 'Unliked profile.',
    });
  } catch (error) {
    next(error);
  }
};

export const getLikesReceived = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;

    const likes = await Like.find({ toUserId: currentUserId })
      .populate('fromUserId', 'username isOnline lastActive')
      .sort({ createdAt: -1 });

    const userIds = likes.map((l: any) => l.fromUserId?._id).filter(Boolean);
    const profiles = await Profile.find({ userId: { $in: userIds } });

    const profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const result = likes
      .filter((l: any) => l.fromUserId)
      .map((l: any) => {
        const p = profileMap.get(l.fromUserId._id.toString());
        return {
          id: l._id,
          userId: l.fromUserId._id,
          username: l.fromUserId.username,
          displayName: p?.displayName || l.fromUserId.username,
          age: p?.age,
          city: p?.city,
          avatarUrl: p?.avatarUrl,
          bio: p?.bio,
          interests: p?.interests,
          likedAt: l.createdAt,
        };
      });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
