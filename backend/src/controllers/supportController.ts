import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ENV } from '../config/env';
import { SupportRequest } from '../models/SupportRequest';
import { Report } from '../models/Report';
import { BlockedUser } from '../models/BlockedUser';
import { FAQ } from '../models/FAQ';
import { Plan } from '../models/Plan';
import { resolveTargetProfile } from './paymentController';

export const getSupportInfo = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    data: {
      email: ENV.SUPPORT_EMAIL || 'frndma.com@gmail.com',
      whatsappNumber: ENV.SUPPORT_WHATSAPP,
      whatsappLink: `https://wa.me/91${ENV.SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hello Frndma Support team, I need assistance with my account.')}`,
      message: 'Need help? Contact Frndma Support at frndma.com@gmail.com.',
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
      res.status(400).json({ success: false, message: 'Reported profile ID and reason are required' });
      return;
    }

    let targetUserId = reportedUserId;
    const { targetProfile, targetUser } = await resolveTargetProfile(reportedUserId);
    if (targetUser && targetUser._id) {
      targetUserId = targetUser._id;
    } else if (targetProfile && targetProfile.userId) {
      targetUserId = targetProfile.userId;
    }

    const report = await Report.create({
      reportedBy: currentUserId,
      reportedUser: targetUserId,
      reason,
      details: details || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Thank you. Your report has been submitted to Frndma Support.',
      data: {
        id: report._id,
        reason: report.reason,
        status: report.status,
      },
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
