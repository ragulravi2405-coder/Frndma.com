const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Render sets process.env.PORT for external incoming traffic
const publicPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Internal Next.js port guaranteed never to collide with publicPort
const internalFrontendPort = publicPort === 3000 ? 3001 : 3000;

console.log('====================================================');
console.log('🚀 Starting Frndma Unified Deployment on Render');
console.log(`📡 Public Server Port (Express + Socket.IO): ${publicPort}`);
console.log(`🔌 Internal Frontend Port (Next.js): ${internalFrontendPort}`);
console.log('====================================================');

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. Launch Next.js Frontend on internal port
const frontendDir = path.resolve(__dirname, '../frontend');
console.log(`⚡ [Frontend] Launching Next.js on internal port ${internalFrontendPort}...`);
const frontend = spawn(npxCmd, ['next', 'start', '-p', String(internalFrontendPort), '-H', '127.0.0.1'], {
  cwd: frontendDir,
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
  console.warn(`⚠️ [Frontend] Process exited with code ${code}`);
});

// 2. Launch Express Backend on the public Render PORT
const backendDir = path.resolve(__dirname, '../backend');
const backendDist = path.join(backendDir, 'dist', 'server.js');
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
