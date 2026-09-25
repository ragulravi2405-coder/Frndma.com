import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/frndma',
  JWT_SECRET: process.env.JWT_SECRET || 'frndma_super_secret_jwt_key_2026_dev_prod_auth_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'frndma_cookie_secret_salt_987654321',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_frndma_mock_key',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_frndma_mock_secret',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret_frndma',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '123456789012345',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'abcdefghijklmnopqrstuvwxyz12345',
  SUPPORT_WHATSAPP: process.env.SUPPORT_WHATSAPP || '9087923641',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'rahul2005',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Abcd@1234',
};
