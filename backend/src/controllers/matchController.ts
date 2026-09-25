import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Match } from '../models/Match';
import { Profile } from '../models/Profile';
import { User } from '../models/User';

export const getMyMatches = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;

    const matches = await Match.find({
      users: currentUserId,
      active: true,
    }).sort({ updatedAt: -1 });

    const results = await Promise.all(
      matches.map(async (m) => {
        const otherUserId = m.users.find((u) => u.toString() !== currentUserId);
        if (!otherUserId) return null;

        const otherUser = await User.findById(otherUserId).select('username isOnline lastActive');
        if (!otherUser || otherUser.isBanned) return null;

        const otherProfile = await Profile.findOne({ userId: otherUserId });

        return {
          matchId: m._id,
          lastMessage: m.lastMessage,
          lastMessageAt: m.lastMessageAt || m.updatedAt,
          user: {
            id: otherUser._id,
            username: otherUser.username,
            displayName: otherProfile?.displayName || otherUser.username,
            avatarUrl: otherProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            age: otherProfile?.age,
            city: otherProfile?.city,
            isOnline: otherUser.isOnline,
            lastActive: otherUser.lastActive,
          },
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

export const getMatchById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { matchId } = req.params;
    const currentUserId = req.userId;

    const match = await Match.findById(matchId);
    if (!match || !match.users.some((u) => u.toString() === currentUserId)) {
      res.status(403).json({ success: false, message: 'Unauthorized match access' });
      return;
    }

    const otherUserId = match.users.find((u) => u.toString() !== currentUserId);
    const otherUser = await User.findById(otherUserId).select('username isOnline lastActive');
    const otherProfile = await Profile.findOne({ userId: otherUserId });

    res.status(200).json({
      success: true,
      data: {
        matchId: match._id,
        createdAt: match.createdAt,
        user: {
          id: otherUser?._id,
          username: otherUser?.username,
          displayName: otherProfile?.displayName,
          avatarUrl: otherProfile?.avatarUrl,
          age: otherProfile?.age,
          city: otherProfile?.city,
          bio: otherProfile?.bio,
          isOnline: otherUser?.isOnline,
          lastActive: otherUser?.lastActive,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
