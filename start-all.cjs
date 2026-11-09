const { spawn } = require('child_process');
const path = require('path');

console.log('\x1b[36m%s\x1b[0m', '=== Starting Aspiring Life Application Services ===');

// Start Backend on Port 5001 (with --watch for auto-restart on file changes)
console.log('\x1b[33m%s\x1b[0m', 'Starting Backend Express server (Port 5001)...');
const backend = spawn('node', ['--watch', path.join(__dirname, 'backend', 'index.js')], {
  stdio: 'inherit',
  shell: true
});

// Start Frontend on Port 3000
console.log('\x1b[32m%s\x1b[0m', 'Starting Frontend Vite dev server (Port 3000)...');
const frontend = spawn('npx', ['vite'], {
  stdio: 'inherit',
  shell: true
});

// Handle graceful exit
const cleanup = () => {
  console.log('\x1b[31m%s\x1b[0m', '\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
