#!/usr/bin/env node

const { spawnSync } = require('child_process');

// Ensure NODE_ENV is strictly production for next build
process.env.NODE_ENV = 'production';

const isWin = process.platform === 'win32';
const cmd = isWin ? 'npx.cmd' : 'npx';

const result = spawnSync(cmd, ['next', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
  },
});

process.exit(result.status !== null ? result.status : 1);
