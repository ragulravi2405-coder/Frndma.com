import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import discoverRoutes from './routes/discoverRoutes';
import likeRoutes from './routes/likeRoutes';
import matchRoutes from './routes/matchRoutes';
import messageRoutes from './routes/messageRoutes';
import paymentRoutes from './routes/paymentRoutes';
import unlockRoutes from './routes/unlockRoutes';
import adminRoutes from './routes/adminRoutes';
import supportRoutes from './routes/supportRoutes';

const app: Application = express();

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!requestOrigin) return callback(null, true);
      // Allow localhost, client URL, or any vercel.app / onrender.com preview
      if (
        requestOrigin === ENV.CLIENT_URL ||
        requestOrigin.includes('localhost') ||
        requestOrigin.includes('127.0.0.1') ||
        requestOrigin.endsWith('.vercel.app') ||
        requestOrigin.endsWith('.onrender.com') ||
        requestOrigin.includes('frndma')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for production deployment
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(cookieParser(ENV.COOKIE_SECRET));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    platform: 'Frndma 18+ Dating Platform',
    timestamp: new Date().toISOString(),
    support: ENV.SUPPORT_WHATSAPP,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/unlocks', unlockRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/support', supportRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
