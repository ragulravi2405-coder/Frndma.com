#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Render sets process.env.PORT for external incoming traffic
const publicPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Internal Next.js port guaranteed never to collide with publicPort
const internalFrontendPort = publicPort === 3000 ? 3001 : 3000;

console.log('====================================================');
console.log('❤️  Frndma - Starting Unified Production Server');
console.log(`📡 Public Server Port (Express + Socket.IO): ${publicPort}`);
console.log(`🔌 Internal Frontend Port (Next.js): ${internalFrontendPort}`);
console.log('====================================================');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Start Next.js Frontend on internal port
console.log(`⚡ [Frontend] Launching Next.js on internal port ${internalFrontendPort}...`);
const frontend = spawn(npxCmd, ['next', 'start', '-p', String(internalFrontendPort), '-H', '127.0.0.1'], {
  cwd: path.resolve(__dirname, '..'),
  env: {
    ...process.env,
    PORT: String(internalFrontendPort),
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
});

// 2. Start Express Backend on public port
const backendDir = path.resolve(__dirname, '../../backend');
const backendDist = path.join(backendDir, 'dist', 'server.js');

if (fs.existsSync(backendDist)) {
  console.log(`🚀 [Backend] Launching Express & Socket.IO server on public port ${publicPort}...`);
  const backend = spawn('node', [backendDist], {
    cwd: backendDir,
    env: {
      ...process.env,
      PORT: String(publicPort),
      FRONTEND_INTERNAL_URL: `http://127.0.0.1:${internalFrontendPort}`,
      NODE_ENV: 'production',
    },
    stdio: 'inherit',
  });

  backend.on('error', (err) => {
    console.error('❌ [Backend] Startup error:', err);
  });

  backend.on('exit', (code) => {
    console.warn(`⚠️ [Backend] Process exited with code ${code}`);
    process.exit(code || 0);
  });
} else {
  console.warn('⚠️ [Backend] server.js not found at:', backendDist);
}

process.on('SIGTERM', () => {
  process.exit(0);
});
process.on('SIGINT', () => {
  process.exit(0);
});
