#!/usr/bin/env node

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure NODE_ENV is strictly production for build
process.env.NODE_ENV = 'production';

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

// 1. If backend directory exists, build backend first
const backendDir = path.resolve(__dirname, '../../backend');
if (fs.existsSync(backendDir)) {
  console.log('📦 [Build] Preparing backend at:', backendDir);
  try {
    spawnSync(npmCmd, ['install', '--include=dev'], {
      cwd: backendDir,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });
    spawnSync(npmCmd, ['run', 'build'], {
      cwd: backendDir,
      stdio: 'inherit',
      shell: true,
      env: process.env,
    });
    console.log('✅ [Build] Backend built successfully.');
  } catch (err) {
    console.warn('⚠️ [Build] Backend build step warning:', err.message);
  }
}

// 2. Build Next.js frontend
const frontendDir = path.resolve(__dirname, '..');
console.log('⚡ [Build] Building Next.js frontend at:', frontendDir);
const result = spawnSync(npxCmd, ['next', 'build'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
});

process.exit(result.status !== null ? result.status : 0);
