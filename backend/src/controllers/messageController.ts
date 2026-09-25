import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Message } from '../models/Message';
import { Match } from '../models/Match';
import { BlockedUser } from '../models/BlockedUser';

export const getMessagesByMatch = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { matchId } = req.params;
    const currentUserId = req.userId;

    const match = await Match.findById(matchId);
    if (!match || !match.users.some((u) => u.toString() === currentUserId)) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this conversation' });
      return;
    }

    const messages = await Message.find({ matchId }).sort({ createdAt: 1 }).limit(100);

    // Mark unread messages sent to me as read
    await Message.updateMany(
      { matchId, recipientId: currentUserId, status: { $ne: 'read' } },
      { $set: { status: 'read' } }
    );

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { matchId, text } = req.body;
    const currentUserId = req.userId;

    if (!text || text.trim() === '') {
      res.status(400).json({ success: false, message: 'Message text cannot be empty' });
      return;
    }

    const match = await Match.findById(matchId);
    if (!match || !match.users.some((u) => u.toString() === currentUserId)) {
      res.status(403).json({ success: false, message: 'Unauthorized match access' });
      return;
    }

    const recipientId = match.users.find((u) => u.toString() !== currentUserId);
    if (!recipientId) {
      res.status(400).json({ success: false, message: 'Recipient not found in match' });
      return;
    }

    // Check if blocked
    const isBlocked = await BlockedUser.findOne({
      $or: [
        { userId: currentUserId, blockedUserId: recipientId },
        { userId: recipientId, blockedUserId: currentUserId },
      ],
    });

    if (isBlocked) {
      res.status(403).json({ success: false, message: 'Cannot send message to this user.' });
      return;
    }

    const newMessage = await Message.create({
      matchId,
      senderId: currentUserId,
      recipientId,
      text: text.trim(),
      status: 'sent',
    });

    // Update match last message preview
    match.lastMessage = text.trim();
    match.lastMessageAt = new Date();
    await match.save();

    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
