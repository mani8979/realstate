const { spawn } = require('child_process');
const path = require('path');

console.log('[Startup Orchestrator] Starting background services...');

// 1. Start WhatsApp background service
const whatsappPath = path.join(__dirname, 'whatsapp-service.js');
console.log(`[Startup Orchestrator] Spawning WhatsApp Service: node ${whatsappPath}`);
const whatsapp = spawn('node', [whatsappPath], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    PUPPETEER_CACHE_DIR: path.join(__dirname, '.cache', 'puppeteer')
  }
});

// 2. Start Next.js production server
const port = process.env.PORT || 10000;
const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
console.log(`[Startup Orchestrator] Spawning Next.js Server: node ${nextPath} start -H 0.0.0.0 -p ${port}`);
const next = spawn('node', [nextPath, 'start', '-H', '0.0.0.0', '-p', port.toString()], {
  stdio: 'inherit',
  shell: false,
  env: process.env
});

// Handle process termination gracefully
const killAll = () => {
  console.log('[Startup Orchestrator] Stopping all services...');
  try {
    whatsapp.kill();
  } catch (err) {
    // Already stopped
  }
  try {
    next.kill();
  } catch (err) {
    // Already stopped
  }
  process.exit(0);
};

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);
process.on('exit', killAll);

// Handle crash of child processes
whatsapp.on('close', (code) => {
  console.log(`[Startup Orchestrator] WhatsApp Service exited with code ${code}`);
  // If one fails, we don't necessarily kill the other, but we log it
});

next.on('close', (code) => {
  console.log(`[Startup Orchestrator] Next.js Server exited with code ${code}`);
  killAll();
});
