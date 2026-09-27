import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  verifyUpiPayment,
  verifyRazorpayLinkPayment,
  notifyPaymentSuccess,
  handleWebhook,
  getPaymentHistory,
  claimPackage999Offer,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/verify-upi', authenticate, verifyUpiPayment);
router.post('/verify-link-payment', authenticate, verifyRazorpayLinkPayment);
router.post('/claim-package-999', (req, res, next) => {
  // If auth header present, authenticate, else continue
  if (req.headers.authorization) {
    return authenticate(req as any, res, next);
  }
  next();
}, claimPackage999Offer);
router.post('/notify-success', authenticate, notifyPaymentSuccess);
router.post('/webhook', handleWebhook);
router.get('/history', authenticate, getPaymentHistory);

export default router;
