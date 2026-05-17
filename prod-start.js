const { spawn } = require('child_process');
const path = require('path');

console.log('[Startup Orchestrator] Starting background services...');

// 1. Start WhatsApp background service
const fs = require('fs');
const logPath = path.join(__dirname, 'whatsapp_error.log');

// Clear previous error log on startup
try {
  if (fs.existsSync(logPath)) {
    fs.unlinkSync(logPath);
  }
} catch (_) {}

const whatsappPath = path.join(__dirname, 'whatsapp-service.js');
console.log(`[Startup Orchestrator] Spawning WhatsApp Service: node --max-old-space-size=100 ${whatsappPath}`);
const whatsapp = spawn('node', ['--max-old-space-size=100', whatsappPath], {
  stdio: ['inherit', 'inherit', 'pipe'], // pipe stderr so we can capture it
  shell: false,
  env: {
    ...process.env,
    PUPPETEER_CACHE_DIR: path.join(__dirname, '.cache', 'puppeteer')
  }
});

whatsapp.stderr.on('data', (data) => {
  const errStr = data.toString();
  process.stderr.write(errStr); // standard logging to Render
  try {
    fs.appendFileSync(logPath, errStr);
  } catch (_) {}
});

// 2. Start Next.js production server
const port = process.env.PORT || 10000;
const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');
console.log(`[Startup Orchestrator] Spawning Next.js Server: node --max-old-space-size=200 ${nextPath} start -H 0.0.0.0 -p ${port}`);
const next = spawn('node', ['--max-old-space-size=200', nextPath, 'start', '-H', '0.0.0.0', '-p', port.toString()], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    EXPERIMENTAL_CPUS: '1',
    NEXT_CPU_LIMIT: '1'
  }
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
