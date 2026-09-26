const { spawn } = require('child_process');
const path = require('path');

const webPort = process.env.PORT || 3000;
const backendPort = 5000;

console.log('====================================================');
console.log('🚀 Starting Frndma Unified Deployment on Render');
console.log(`📡 Web Port (Next.js): ${webPort}`);
console.log(`🔌 Internal Backend Port (Express): ${backendPort}`);
console.log('====================================================');

// 1. Launch Express backend on port 5000 (connected to MongoDB Atlas)
const backend = spawn('node', ['backend/dist/server.js'], {
  env: {
    ...process.env,
    PORT: String(backendPort),
    NODE_ENV: 'production',
  },
  stdio: 'inherit',
});

backend.on('error', (err) => {
  console.error('❌ Backend failed to start:', err);
});

backend.on('exit', (code) => {
  console.warn(`[Backend] Process exited with code ${code}`);
});

// 2. Launch Next.js on Render's external port
const frontend = spawn('npx', ['next', 'start', 'frontend', '-p', String(webPort)], {
  env: {
    ...process.env,
    PORT: String(webPort),
    BACKEND_URL: `http://127.0.0.1:${backendPort}`,
    NODE_ENV: 'production',
  },
  stdio: 'inherit',
  shell: true,
});

frontend.on('error', (err) => {
  console.error('❌ Frontend failed to start:', err);
});

frontend.on('exit', (code) => {
  console.warn(`[Frontend] Process exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});
