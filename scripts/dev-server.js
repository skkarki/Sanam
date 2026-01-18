#!/usr/bin/env node
const { spawn } = require('child_process');
const net = require('net');

const PORTS = [3000, 3001, 3002, 3003, 3004, 3005];

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

async function findAvailablePort() {
  for (const port of PORTS) {
    const available = await checkPort(port);
    if (available) {
      return port;
    }
    console.log(`Port ${port} is in use, trying next...`);
  }
  throw new Error('No available ports found in range 3000-3005');
}

async function startServer() {
  try {
    const port = await findAvailablePort();
    console.log(`\nStarting Next.js dev server on port ${port}...\n`);
    
    const nextProcess = spawn('npx', ['next', 'dev', '-p', port.toString()], {
      stdio: 'inherit',
      shell: true
    });

    nextProcess.on('error', (err) => {
      console.error('Failed to start server:', err);
      process.exit(1);
    });

    nextProcess.on('close', (code) => {
      process.exit(code);
    });

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
