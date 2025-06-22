#!/usr/bin/env node
// This script allows easier startup of the standalone Next.js server
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name using ES modules pattern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the standalone server
const serverPath = path.join(__dirname, '.next', 'standalone', 'server.js');

// Check if the server file exists
if (!fs.existsSync(serverPath)) {
  console.error('\x1b[31m%s\x1b[0m', 'ERROR: Standalone server not found!');
  console.log(
    '\x1b[33m%s\x1b[0m',
    'Make sure you have built the project with:',
  );
  console.log('  npm run build');
  console.log(
    '\x1b[33m%s\x1b[0m',
    'This script must be run after a successful build with "output: standalone" config.',
  );
  process.exit(1);
}

// Get port from environment variable or use default
const PORT = process.env.PORT || 3000;

console.log(
  '\x1b[36m%s\x1b[0m',
  `Starting standalone server on port ${PORT}...`,
);
console.log('\x1b[90m%s\x1b[0m', `(Press Ctrl+C to stop the server)`);

// Run the server with the current Node process environment
const server = spawn('node', [serverPath], {
  env: { ...process.env, PORT },
  stdio: 'inherit',
});

// Handle server process events
server.on('error', (err) => {
  console.error('\x1b[31m%s\x1b[0m', 'Failed to start server:', err);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.log('\x1b[31m%s\x1b[0m', `Server exited with code ${code}`);
  }
});

// Forward process signals to the child process
['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    console.log('\x1b[36m%s\x1b[0m', 'Shutting down server...');
    server.kill(signal);
    process.exit(0);
  });
});
