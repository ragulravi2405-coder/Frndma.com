#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const webPort = process.env.PORT || 3000;
const backendPort = 5000;

console.log('====================================================');
console.log('❤️  Frndma - Starting Unified Production Server');
console.log(`🌐 Frontend External Port: ${webPort}`);
console.log(`🔌 Backend Internal Port: ${backendPort}`);
console.log('====================================================');

// 1. Start Express Backend
const backendDir = path.resolve(__dirname, '../../backend');
const backendDist = path.join(backendDir, 'dist', 'server.js');

if (fs.existsSync(backendDist)) {
  console.log('🚀 [Backend] Launching Express & Socket.io server from:', backendDist);
  const backend = spawn('node', [backendDist], {
    cwd: backendDir,
    env: {
      ...process.env,
      PORT: String(backendPort),
      NODE_ENV: 'production',
    },
    stdio: 'inherit',
  });

  backend.on('error', (err) => {
    console.error('❌ [Backend] Startup error:', err);
  });

  backend.on('exit', (code) => {
    console.warn(`⚠️ [Backend] Process exited with code ${code}`);
  });
} else {
  console.warn('⚠️ [Backend] server.js not found at:', backendDist);
}

// 2. Start Next.js Frontend
console.log('⚡ [Frontend] Launching Next.js on port', webPort);
const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const frontend = spawn(npxCmd, ['next', 'start', '-p', String(webPort)], {
  cwd: path.resolve(__dirname, '..'),
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
  console.error('❌ [Frontend] Startup error:', err);
});

frontend.on('exit', (code) => {
  console.warn(`[Frontend] Exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});
process.on('SIGINT', () => {
  process.exit(0);
});
