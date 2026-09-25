import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { Message } from '../models/Message';
import { Match } from '../models/Match';
import { User } from '../models/User';

export interface AuthSocket extends Socket {
  userId?: string;
  username?: string;
}

export const setupChatSocket = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication required for real-time chat'));
      }

      const decoded = jwt.verify(token as string, ENV.JWT_SECRET) as { userId: string };
      socket.userId = decoded.userId;

      const user = await User.findById(decoded.userId);
      if (user) {
        socket.username = user.username;
      }

      next();
    } catch (err) {
      next(new Error('Invalid socket authentication token'));
    }
  });

  io.on('connection', async (socket: AuthSocket) => {
    const userId = socket.userId;
    if (!userId) return;

    console.log(`[Socket] User connected: ${socket.username} (${userId})`);

    // Mark user as online in DB
    await User.findByIdAndUpdate(userId, { isOnline: true, lastActive: new Date() });

    // Join personal user room for direct notifications
    socket.join(`user_${userId}`);
    io.emit('user_status_changed', { userId, isOnline: true });

    // Join match conversation room
    socket.on('join_match', async ({ matchId }) => {
      if (!matchId) return;

      const match = await Match.findById(matchId);
      if (match && match.users.some((u) => u.toString() === userId)) {
        socket.join(`match_${matchId}`);
        console.log(`[Socket] ${socket.username} joined match_${matchId}`);
      }
    });

    socket.on('leave_match', ({ matchId }) => {
      socket.leave(`match_${matchId}`);
    });

    // Real-time message event
    socket.on('send_message', async ({ matchId, text }) => {
      try {
        if (!matchId || !text || text.trim() === '') return;

        const match = await Match.findById(matchId);
        if (!match || !match.users.some((u) => u.toString() === userId)) return;

        const recipientId = match.users.find((u) => u.toString() !== userId);
        if (!recipientId) return;

        const message = await Message.create({
          matchId,
          senderId: userId,
          recipientId,
          text: text.trim(),
          status: 'sent',
        });

        match.lastMessage = text.trim();
        match.lastMessageAt = new Date();
        await match.save();

        const messagePayload = {
          _id: message._id,
          matchId,
          senderId: userId,
          recipientId: recipientId.toString(),
          text: message.text,
          status: message.status,
          createdAt: message.createdAt,
        };

        // Broadcast to everyone in the match room
        io.to(`match_${matchId}`).emit('new_message', messagePayload);

        // Also push notification to recipient's personal room
        io.to(`user_${recipientId.toString()}`).emit('message_notification', {
          matchId,
          senderId: userId,
          senderUsername: socket.username,
          text: message.text,
          createdAt: message.createdAt,
        });
      } catch (err) {
        console.error('[Socket Send Error]', err);
      }
    });

    // Typing indicators
    socket.on('typing_start', ({ matchId }) => {
      socket.to(`match_${matchId}`).emit('user_typing', { matchId, userId, isTyping: true });
    });

    socket.on('typing_stop', ({ matchId }) => {
      socket.to(`match_${matchId}`).emit('user_typing', { matchId, userId, isTyping: false });
    });

    // Mark messages read
    socket.on('mark_read', async ({ matchId }) => {
      await Message.updateMany(
        { matchId, recipientId: userId, status: { $ne: 'read' } },
        { $set: { status: 'read' } }
      );
      socket.to(`match_${matchId}`).emit('messages_read', { matchId, readBy: userId });
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket] User disconnected: ${socket.username} (${userId})`);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastActive: new Date() });
      io.emit('user_status_changed', { userId, isOnline: false, lastActive: new Date() });
    });
  });
};
