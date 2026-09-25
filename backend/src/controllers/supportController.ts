import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ENV } from '../config/env';
import { SupportRequest } from '../models/SupportRequest';
import { Report } from '../models/Report';
import { BlockedUser } from '../models/BlockedUser';
import { FAQ } from '../models/FAQ';
import { Plan } from '../models/Plan';

export const getSupportInfo = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {
      whatsappNumber: ENV.SUPPORT_WHATSAPP,
      whatsappLink: `https://wa.me/91${ENV.SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hello Frndma Support team, I need assistance with my account.')}`,
      message: 'Need help? Our support team is available on WhatsApp.',
    },
  });
};

export const submitSupportRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, contact, message, channel = 'whatsapp' } = req.body;
    const userId = req.userId;

    const request = await SupportRequest.create({
      userId: userId || undefined,
      name,
      contact,
      message,
      channel,
      status: 'open',
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted. Our team will contact you shortly.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

export const reportUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { reportedUserId, reason, details } = req.body;

    if (!reportedUserId || !reason) {
      res.status(400).json({ success: false, message: 'Reported user ID and reason are required' });
      return;
    }

    const report = await Report.create({
      reportedBy: currentUserId,
      reportedUser: reportedUserId,
      reason,
      details: details || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our moderation team reviews all reports strictly within 24 hours.',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { blockedUserId } = req.body;

    if (!blockedUserId) {
      res.status(400).json({ success: false, message: 'Target user ID is required' });
      return;
    }

    await BlockedUser.findOneAndUpdate(
      { userId: currentUserId, blockedUserId },
      { userId: currentUserId, blockedUserId },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'User blocked successfully. They will no longer be able to view your profile or contact you.',
    });
  } catch (error) {
    next(error);
  }
};

export const unblockUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { blockedUserId } = req.params;

    await BlockedUser.findOneAndDelete({ userId: currentUserId, blockedUserId });

    res.status(200).json({
      success: true,
      message: 'User unblocked.',
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicFAQs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicPlans = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};
