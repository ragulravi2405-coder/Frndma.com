import { Router } from 'express';
import {
  createOrder,
  verifyPayment,
  verifyUpiPayment,
  verifyRazorpayLinkPayment,
  notifyPaymentSuccess,
  handleWebhook,
  getPaymentHistory,
} from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);
router.post('/verify-upi', authenticate, verifyUpiPayment);
router.post('/verify-link-payment', authenticate, verifyRazorpayLinkPayment);
router.post('/notify-success', authenticate, notifyPaymentSuccess);
router.post('/webhook', handleWebhook);
router.get('/history', authenticate, getPaymentHistory);

export default router;
