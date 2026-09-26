import axios from 'axios';
import { ENV } from '../config/env';

export interface PaymentAlertData {
  userName: string;
  userMobile: string;
  paymentStatus: string; // e.g. "Payment Successful for ₹399"
  amount: number;
  paymentId?: string;
  orderId?: string;
  paymentType?: string;
  targetProfileName?: string;
}

/**
 * Format the WhatsApp notification message according to the required template
 */
export const formatPaymentWhatsAppMessage = (data: PaymentAlertData): string => {
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const purpose = data.paymentType === 'contact_unlock'
    ? `Contact Unlock (${data.targetProfileName || 'Profile'})`
    : 'Subscription';

  return `🔔 *Frndma - New Payment Notification*\n\n` +
    `👤 *User Name:* ${data.userName}\n` +
    `💰 *Payment Status:* ${data.paymentStatus}\n` +
    `📱 *User Mobile / Contact:* ${data.userMobile}\n` +
    `💳 *Payment ID:* ${data.paymentId || 'rzp_link_pay'}\n` +
    `🎯 *Purpose:* ${purpose}\n` +
    `⏰ *Time:* ${time}`;
};

/**
 * Send WhatsApp notification to Admin (9087923641)
 * Supports WhatsApp Cloud API / webhook / direct api, with console & link fallback
 */
export const sendAdminWhatsAppPaymentAlert = async (data: PaymentAlertData): Promise<{ success: boolean; message: string; waLink: string }> => {
  const adminNumber = ENV.SUPPORT_WHATSAPP || '9087923641';
  const cleanAdminNumber = adminNumber.replace(/\D/g, '').replace(/^91/, '');
  const fullAdminNumber = `91${cleanAdminNumber}`;

  const messageText = formatPaymentWhatsAppMessage(data);
  const waLink = `https://api.whatsapp.com/send?phone=${fullAdminNumber}&text=${encodeURIComponent(messageText)}`;

  console.log('\n======================================================');
  console.log('📲 [WHATSAPP PAYMENT NOTIFICATION TO ADMIN 9087923641]');
  console.log('======================================================');
  console.log(messageText);
  console.log('🔗 Direct WhatsApp Chat Link:', waLink);
  console.log('======================================================\n');

  // If a 3rd party WhatsApp API gateway is configured in environment
  const whatsappApiUrl = process.env.WHATSAPP_API_URL;
  const whatsappApiToken = process.env.WHATSAPP_API_TOKEN;

  if (whatsappApiUrl && whatsappApiToken) {
    try {
      await axios.post(
        whatsappApiUrl,
        {
          phone: fullAdminNumber,
          message: messageText,
        },
        {
          headers: {
            Authorization: `Bearer ${whatsappApiToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 8000,
        }
      );
      console.log(`[WhatsApp] Sent successfully to admin ${fullAdminNumber} via API gateway.`);
      return { success: true, message: 'WhatsApp message sent via API', waLink };
    } catch (apiErr) {
      console.warn('[WhatsApp] API Gateway dispatch failed, using fallback:', (apiErr as Error).message);
    }
  }

  return {
    success: true,
    message: 'WhatsApp notification logged and ready for dispatch',
    waLink,
  };
};
