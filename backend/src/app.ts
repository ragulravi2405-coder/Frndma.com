import http from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
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

// Trust reverse proxy (for Render, Heroku, Vercel, Docker load balancers)
app.set('trust proxy', 1);

// Security Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

const corsOptions: cors.CorsOptions = {
  origin: (requestOrigin, callback) => {
    // Permissive for mobile apps, localhost, previews, and production
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(cookieParser(ENV.COOKIE_SECRET));
app.use('/api', express.json({ limit: '10mb' }));
app.use('/api', express.urlencoded({ extended: true, limit: '10mb' }));

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

// Unified Mode: Proxy non-API requests to internal Next.js frontend
if (ENV.FRONTEND_INTERNAL_URL) {
  try {
    const targetUrl = new URL(ENV.FRONTEND_INTERNAL_URL);
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path === '/health' || req.path.startsWith('/socket.io')) {
        return next();
      }

      const proxyReq = http.request(
        {
          hostname: targetUrl.hostname,
          port: targetUrl.port,
          path: req.originalUrl,
          method: req.method,
          headers: {
            ...req.headers,
            host: req.headers.host,
            'x-forwarded-for': (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress,
            'x-forwarded-proto': (req.headers['x-forwarded-proto'] as string) || (req.secure ? 'https' : 'http'),
          },
        },
        (proxyRes) => {
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        }
      );

      proxyReq.on('error', (err) => {
        if (!res.headersSent) {
          res.status(502).send('Frontend is initializing... Please refresh shortly.');
        }
      });

      if (req.readable) {
        req.pipe(proxyReq, { end: true });
      } else {
        proxyReq.end();
      }
    });
  } catch (err) {
    console.error('Failed to initialize FRONTEND_INTERNAL_URL proxy:', err);
  }
}

// Global Error Handler
app.use(errorHandler);

export default app;
