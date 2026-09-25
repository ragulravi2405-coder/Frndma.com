import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { setupChatSocket } from './sockets/chatSocket';
import { seedDatabase } from './utils/seed';

const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: (requestOrigin, callback) => {
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

setupChatSocket(io);

// Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed default plans and configuration
    await seedDatabase();

    server.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(`===============================================`);
      console.log(`❤️  Frndma API & Socket Server running on port ${ENV.PORT}`);
      console.log(`🚀 Mode: ${ENV.NODE_ENV}`);
      console.log(`🌐 Allowed Client URL: ${ENV.CLIENT_URL}`);
      console.log(`📞 Support WhatsApp: ${ENV.SUPPORT_WHATSAPP}`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error('Fatal Server Startup Error:', error);
    process.exit(1);
  }
};

startServer();
