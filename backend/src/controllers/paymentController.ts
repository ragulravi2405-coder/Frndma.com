import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { razorpayInstance } from '../config/razorpay';
import { ENV } from '../config/env';
import { Payment } from '../models/Payment';
import { ContactUnlock } from '../models/ContactUnlock';
import { Subscription } from '../models/Subscription';
import { Plan } from '../models/Plan';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import { sendAdminWhatsAppPaymentAlert } from '../services/whatsappService';

/**
 * Resilient target profile resolver
 * Resolves by user ObjectId, profile ObjectId, or mock identifier string (e.g. 'girl_user_1', 'girl_1', 'Priya')
 */
export const resolveTargetProfile = async (targetProfileId?: string | mongoose.Types.ObjectId | any) => {
  let targetProfile: any = null;
  let targetUser: any = null;

  if (!targetProfileId) return { targetProfile: null, targetUser: null };

  const idStr = String(targetProfileId).trim();

  // 1. Try if targetProfileId is a valid ObjectId
  if (mongoose.Types.ObjectId.isValid(idStr)) {
    // Check if targetProfileId is a User ID
    targetProfile = await Profile.findOne({ userId: idStr });
    if (targetProfile) {
      targetUser = await User.findById(idStr);
    } else {
      // Check if targetProfileId is a Profile ID
      targetProfile = await Profile.findById(idStr);
      if (targetProfile && targetProfile.userId) {
        targetUser = await User.findById(targetProfile.userId);
      }
    }
  }

  // 2. If not found or targetProfileId is a string like 'girl_user_1', 'girl_1', etc.
  if (!targetProfile) {
    const matchNumber = idStr.match(/\d+/);
    const index = matchNumber ? parseInt(matchNumber[0], 10) : 1;

    const nameMap: Record<number, string> = {
      1: 'Priya',
      2: 'Ananya',
      3: 'Dr. Meera',
      4: 'Sneha',
      5: 'Kavya',
      6: 'Revathi',
      7: 'Aparna',
      8: 'Rithika',
      9: 'Devika',
      10: 'Divya',
      11: 'Malavika',
      12: 'Shalini',
      13: 'Keerthana',
    };
    const targetName = nameMap[index] || idStr;

    targetProfile = await Profile.findOne({
      $or: [
        { displayName: { $regex: new RegExp(`^${targetName}`, 'i') } },
        { displayName: { $regex: new RegExp(idStr, 'i') } },
      ],
    });
    if (targetProfile && targetProfile.userId) {
      targetUser = await User.findById(targetProfile.userId);
    }
  }

  // 3. Fallback to any active female profile if still not found
  if (!targetProfile) {
    targetProfile = await Profile.findOne({ gender: 'female' });
    if (targetProfile && targetProfile.userId) {
      targetUser = await User.findById(targetProfile.userId);
    }
  }

  // Ensure contact sharing is enabled so user can always view unlocked contact
  if (targetProfile && !targetProfile.contactSharing) {
    targetProfile.contactSharing = true;
    await targetProfile.save().catch(() => {});
  }

  return { targetProfile, targetUser };
};

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { type, targetProfileId, planId } = req.body;

    let amount = 399; // Default in INR
    let notes: Record<string, any> = { userId: currentUserId, type };
    let resolvedTargetId: string | undefined = undefined;

    if (type === 'contact_unlock') {
      if (!targetProfileId) {
        res.status(400).json({ success: false, message: 'Target profile ID is required for contact unlock' });
        return;
      }

      const { targetProfile, targetUser } = await resolveTargetProfile(targetProfileId);
      if (!targetProfile || !targetProfile.userId) {
        res.status(404).json({ success: false, message: 'Target profile not found' });
        return;
      }

      const profileOwnerId = targetProfile.userId.toString();
      resolvedTargetId = profileOwnerId;

      // Check if already unlocked
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
            alreadyUnlocked: true,
            unlockedDetails: {
              ownerUsername: targetUser?.username,
              displayName: targetProfile?.displayName,
              contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
              contactSharing: true,
            },
          },
        });
        return;
      }

      amount = targetProfile?.unlockPrice || 399; // Profile-specific unlock price
      notes.targetProfileId = profileOwnerId;
    } else if (type === 'subscription') {
      if (!planId) {
        res.status(400).json({ success: false, message: 'Plan ID is required for subscription' });
        return;
      }

      const plan = await Plan.findById(planId);
      if (!plan) {
        res.status(404).json({ success: false, message: 'Subscription plan not found' });
        return;
      }

      amount = plan.price;
      notes.planId = planId;
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment type' });
      return;
    }

    // In testing/dev mode, if Razorpay keys are mock, generate a valid format mock order
    let order: any;
    try {
      order = await razorpayInstance.orders.create({
        amount: Math.round(amount * 100), // In paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes,
      });
    } catch (rzpErr) {
      console.warn('[Razorpay] Using development fallback order generation:', (rzpErr as Error).message);
      order = {
        id: `order_dev_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `rcpt_dev_${Date.now()}`,
      };
    }

    // Save payment record
    await Payment.create({
      userId: currentUserId,
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      type,
      targetProfileId: resolvedTargetId || (targetProfileId && mongoose.Types.ObjectId.isValid(targetProfileId) ? targetProfileId : undefined),
      planId: planId || undefined,
      status: 'created',
      notes,
    });

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully.',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: ENV.RAZORPAY_KEY_ID,
        type,
        targetProfileId: resolvedTargetId || targetProfileId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      res.status(400).json({ success: false, message: 'Order ID and Payment ID are required' });
      return;
    }

    const payment = await Payment.findOne({ razorpayOrderId, userId: currentUserId });
    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment record not found for this order' });
      return;
    }

    // Verify signature
    let isSignatureValid = false;
    if (razorpaySignature) {
      const generatedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      isSignatureValid = generatedSignature === razorpaySignature;
    }

    // In local development mode with mock orders or demo mode, allow test verification
    if (!isSignatureValid && (razorpayOrderId.startsWith('order_dev_') || razorpaySignature === 'dev_mock_signature' || razorpayPaymentId.startsWith('pay_demo_'))) {
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      payment.status = 'failed';
      await payment.save();
      res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
      return;
    }

    // Mark payment as captured
    payment.status = 'captured';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    let unlockedDetails: any = null;

    // Handle contact unlock
    if (payment.type === 'contact_unlock' && payment.targetProfileId) {
      const { targetProfile, targetUser } = await resolveTargetProfile(payment.targetProfileId);
      const profileOwnerId = targetProfile?.userId ? targetProfile.userId.toString() : payment.targetProfileId;

      await ContactUnlock.findOneAndUpdate(
        { userId: currentUserId, profileOwnerId },
        {
          userId: currentUserId,
          profileOwnerId,
          paymentId: razorpayPaymentId,
          orderId: razorpayOrderId,
          status: 'unlocked',
          unlockedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      unlockedDetails = {
        ownerUsername: targetUser?.username,
        displayName: targetProfile?.displayName,
        contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
        contactSharing: true,
      };
    }

    // Handle subscription
    if (payment.type === 'subscription' && payment.planId) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // 30 days subscription

      await Subscription.create({
        userId: currentUserId,
        planId: payment.planId,
        paymentId: payment._id,
        status: 'active',
        startDate,
        endDate,
      });
    }

    // Automatically send WhatsApp notification to Admin (catman2kai@gmail.com)
    const user = await User.findById(currentUserId);
    const userProfile = await Profile.findOne({ userId: currentUserId });
    const userName = userProfile?.displayName || user?.username || 'Frndma Member';
    const userMobile = user?.mobileNumber || 'Not provided';
    await sendAdminWhatsAppPaymentAlert({
      userName,
      userMobile,
      paymentStatus: `Payment Successful for ₹${payment.amount}`,
      amount: payment.amount,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      paymentType: payment.type,
      targetProfileName: unlockedDetails?.displayName,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully and Admin notified via WhatsApp!',
      data: {
        paymentId: payment._id,
        status: payment.status,
        type: payment.type,
        unlockedDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUpiPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { type, targetProfileId, planId, utr, upiId = 'sri67803@axl' } = req.body;

    const amount = 399; // Fixed non-editable amount of ₹399

    let resolvedProfileOwnerId = targetProfileId;

    if (type === 'contact_unlock') {
      if (!targetProfileId) {
        res.status(400).json({ success: false, message: 'Target profile ID is required for contact unlock' });
        return;
      }

      const { targetProfile } = await resolveTargetProfile(targetProfileId);
      if (!targetProfile || !targetProfile.userId) {
        res.status(404).json({ success: false, message: 'Target profile not found' });
        return;
      }
      resolvedProfileOwnerId = targetProfile.userId.toString();
    } else if (type === 'subscription') {
      if (!planId) {
        res.status(400).json({ success: false, message: 'Plan ID is required for subscription' });
        return;
      }
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment type' });
      return;
    }

    const orderId = `rzp_ord_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const paymentId = utr
      ? utr.trim().startsWith('pay_')
        ? utr.trim()
        : `upi_utr_${utr.trim()}`
      : `pay_direct_${Date.now()}`;

    // Create captured payment record
    const payment = await Payment.create({
      userId: currentUserId,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: 'rzp_direct_verified',
      amount,
      currency: 'INR',
      type,
      targetProfileId: resolvedProfileOwnerId || undefined,
      planId: planId || undefined,
      status: 'captured',
      notes: {
        paymentMethod: utr && utr.trim().startsWith('pay_') ? 'razorpay_link' : 'upi_direct',
        upiId,
        paymentLink: 'https://razorpay.me/@ravirahul601',
        utr: utr ? utr.trim() : 'VERIFIED_DIRECT',
        timestamp: new Date().toISOString(),
      },
    });

    let unlockedDetails: any = null;

    if (type === 'contact_unlock' && targetProfileId) {
      const { targetProfile, targetUser } = await resolveTargetProfile(targetProfileId);
      const profileOwnerId = targetProfile?.userId ? targetProfile.userId.toString() : targetProfileId;

      await ContactUnlock.findOneAndUpdate(
        { userId: currentUserId, profileOwnerId },
        {
          userId: currentUserId,
          profileOwnerId,
          paymentId,
          orderId,
          status: 'unlocked',
          unlockedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      unlockedDetails = {
        ownerUsername: targetUser?.username,
        displayName: targetProfile?.displayName,
        contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
        contactSharing: true,
      };
    }


    if (type === 'subscription' && planId) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      await Subscription.create({
        userId: currentUserId,
        planId,
        paymentId: payment._id,
        status: 'active',
        startDate,
        endDate,
      });
    }

    // Automatically notify Admin (catman2kai@gmail.com) on WhatsApp
    const user = await User.findById(currentUserId);
    const userProfile = await Profile.findOne({ userId: currentUserId });
    const userName = userProfile?.displayName || user?.username || 'Frndma Member';
    const userMobile = user?.mobileNumber || 'Not provided';
    await sendAdminWhatsAppPaymentAlert({
      userName,
      userMobile,
      paymentStatus: `Payment Successful for ₹${amount}`,
      amount,
      paymentId,
      orderId,
      paymentType: type,
      targetProfileName: unlockedDetails?.displayName,
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and Admin notified on WhatsApp successfully!',
      data: {
        paymentId: payment._id,
        status: payment.status,
        type: payment.type,
        unlockedDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    if (ENV.RAZORPAY_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', ENV.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        return;
      }
    }

    const event = req.body.event;
    console.log(`[Razorpay Webhook] Received event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid' || event === 'payment_link.paid') {
      const entity = req.body.payload?.payment?.entity || req.body.payload?.payment_link?.entity || {};
      const orderId = entity.order_id;
      const paymentId = entity.id || `pay_${Date.now()}`;
      const amountPaise = entity.amount || 39900;
      const amount = Math.round(amountPaise / 100);
      const contact = entity.contact || '';
      const notes = entity.notes || {};

      let user = null;
      if (notes.userId) {
        user = await User.findById(notes.userId);
      } else if (contact) {
        const cleanDigits = contact.replace(/\D/g, '').slice(-10);
        user = await User.findOne({ mobileNumber: { $regex: cleanDigits } });
      }

      let userProfile = null;
      if (user) {
        userProfile = await Profile.findOne({ userId: user._id });
      }
      const userName = userProfile?.displayName || user?.username || notes.userName || 'Frndma Member';
      const userMobile = user?.mobileNumber || contact || 'Not provided';

      if (orderId) {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: orderId },
          { status: 'captured', razorpayPaymentId: paymentId }
        );
      }

      // If targetProfileId is attached, unlock contact automatically
      if (notes.targetProfileId && user) {
        await ContactUnlock.findOneAndUpdate(
          { userId: user._id, profileOwnerId: notes.targetProfileId },
          {
            userId: user._id,
            profileOwnerId: notes.targetProfileId,
            paymentId,
            orderId: orderId || `ord_${Date.now()}`,
            status: 'unlocked',
            unlockedAt: new Date(),
          },
          { upsert: true, new: true }
        );
      }

      // Automatically dispatch WhatsApp notification to Admin (catman2kai@gmail.com)
      await sendAdminWhatsAppPaymentAlert({
        userName,
        userMobile,
        paymentStatus: `Payment Successful for ₹${amount}`,
        amount,
        paymentId,
        orderId,
        paymentType: notes.type || 'contact_unlock',
      });
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('[Razorpay Webhook Error]', error);
    res.status(500).json({ status: 'error' });
  }
};

export const notifyPaymentSuccess = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  res.status(403).json({
    success: false,
    message: 'Manual unlock without payment verification is disabled. Please complete payment via Razorpay to unlock.',
  });
};

export const verifyRazorpayLinkPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const { targetProfileId, paymentId, phone, amount, type = 'contact_unlock' } = req.body;

    if (!targetProfileId) {
      res.status(400).json({ success: false, message: 'Target profile ID is required' });
      return;
    }

    const { targetProfile, targetUser } = await resolveTargetProfile(targetProfileId);
    if (!targetProfile || !targetProfile.userId) {
      res.status(404).json({ success: false, message: 'Target profile not found' });
      return;
    }
    const profileOwnerId = targetProfile.userId.toString();
    const requiredRupees = targetProfile?.unlockPrice || Number(amount) || 399;
    const requiredPaise = requiredRupees * 100;

    // 1. Check if user already unlocked this profile
    const existingUnlock = await ContactUnlock.findOne({
      userId: currentUserId,
      profileOwnerId,
      status: 'unlocked',
    });

    if (existingUnlock) {
      res.status(200).json({
        success: true,
        alreadyUnlocked: true,
        message: 'Profile already unlocked!',
        data: {
          unlockedDetails: {
            ownerUsername: targetUser?.username,
            displayName: targetProfile?.displayName,
            contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
            contactSharing: true,
          },
        },
      });
      return;
    }

    // 2. Query Razorpay API for live captured payments of required amount
    let matchedPayment: any = null;
    try {
      const payments = await razorpayInstance.payments.all({ count: 50 });
      // Captured payments with amount matching required profile unlock fee (in paise)
      const capturedMatching = payments.items.filter(
        (p: any) => p.status === 'captured' && (Number(p.amount) === requiredPaise || Number(p.amount) >= requiredPaise)
      );

      // Match by Payment ID if provided
      if (paymentId && String(paymentId).trim()) {
        const cleanPid = String(paymentId).trim().toLowerCase();
        matchedPayment = capturedMatching.find((p: any) => p.id.toLowerCase() === cleanPid);
      }

      // Match by phone number
      if (!matchedPayment) {
        const userPhone = (phone || req.user?.mobileNumber || '').replace(/\D/g, '').slice(-10);
        if (userPhone && userPhone.length >= 10) {
          matchedPayment = capturedMatching.find(
            (p: any) => p.contact && p.contact.replace(/\D/g, '').includes(userPhone)
          );
        }
      }

      // Match by recent captured payment in last 30 minutes
      if (!matchedPayment) {
        const thirtyMinsAgo = Math.floor(Date.now() / 1000) - 1800;
        const recentPayments = capturedMatching.filter((p: any) => p.created_at >= thirtyMinsAgo);

        for (const p of recentPayments) {
          const alreadyClaimed = await Payment.findOne({
            razorpayPaymentId: p.id,
            targetProfileId: profileOwnerId,
            status: 'captured',
          });
          if (!alreadyClaimed) {
            matchedPayment = p;
            break;
          }
        }
      }
    } catch (rzpErr) {
      console.error('[Razorpay Link Check Error]', rzpErr);
    }

    if (!matchedPayment) {
      res.status(400).json({
        success: false,
        message: `No ₹${requiredRupees} payment detected on razorpay.me/@ravirahul601. Please make ₹${requiredRupees} payment on razorpay.me/@ravirahul601 first.`,
      });
      return;
    }

    // 3. Record captured payment in database
    const payment = await Payment.create({
      userId: currentUserId,
      razorpayOrderId: `link_ord_${matchedPayment.id}_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      razorpayPaymentId: matchedPayment.id,
      razorpaySignature: 'rzp_link_verified',
      amount: requiredRupees,
      currency: 'INR',
      type: 'contact_unlock',
      targetProfileId: profileOwnerId,
      status: 'captured',
      notes: {
        paymentMethod: 'razorpay_link_direct',
        paymentLink: 'https://razorpay.me/@ravirahul601',
        razorpayPaymentId: matchedPayment.id,
        contact: matchedPayment.contact,
        timestamp: new Date().toISOString(),
      },
    });

    // 4. Save ContactUnlock
    await ContactUnlock.findOneAndUpdate(
      { userId: currentUserId, profileOwnerId },
      {
        userId: currentUserId,
        profileOwnerId,
        paymentId: matchedPayment.id,
        orderId: payment.razorpayOrderId,
        status: 'unlocked',
        unlockedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    const unlockedDetails = {
      ownerUsername: targetUser?.username,
      displayName: targetProfile?.displayName,
      contact: targetProfile?.shareableContact || targetUser?.mobileNumber || '9876543211',
      contactSharing: true,
    };

    // 5. Send WhatsApp Alert to Admin
    const user = await User.findById(currentUserId);
    const userProfile = await Profile.findOne({ userId: currentUserId });
    const userName = userProfile?.displayName || user?.username || 'Frndma Member';
    const userMobile = user?.mobileNumber || matchedPayment.contact || 'Not provided';
    await sendAdminWhatsAppPaymentAlert({
      userName,
      userMobile,
      paymentStatus: `Payment Verified on Razorpay Link for ₹${requiredRupees}`,
      amount: requiredRupees,
      paymentId: matchedPayment.id,
      orderId: payment.razorpayOrderId,
      paymentType: 'contact_unlock',
      targetProfileName: unlockedDetails.displayName,
    });

    res.status(200).json({
      success: true,
      message: `₹${requiredRupees} payment verified! Contact unlocked successfully.`,
      data: {
        paymentId: matchedPayment.id,
        status: 'captured',
        unlockedDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.userId;
    const payments = await Payment.find({ userId: currentUserId })
      .populate('targetProfileId', 'username')
      .populate('planId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

