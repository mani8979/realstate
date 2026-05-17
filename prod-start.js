const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('[Startup Orchestrator] Starting all services...');

// ─── Error Log ─────────────────────────────────────────────────────────────────
const logPath = path.join(__dirname, 'whatsapp_error.log');
try { if (fs.existsSync(logPath)) fs.unlinkSync(logPath); } catch (_) {}

// ─── 1. WhatsApp Background Service ───────────────────────────────────────────
const whatsappPath = path.join(__dirname, 'whatsapp-service.js');

function spawnWhatsApp() {
  console.log('[Startup Orchestrator] Spawning WhatsApp service...');

  const whatsapp = spawn('node', ['--max-old-space-size=256', whatsappPath], {
    stdio: ['inherit', 'inherit', 'pipe'],
    shell: false,
    env: {
      ...process.env,
      // The Chrome binary installed by "npx puppeteer browsers install chrome" in the Dockerfile
      // lives at this path inside the Docker container image.
      PUPPETEER_CACHE_DIR: process.env.PUPPETEER_CACHE_DIR || path.join(__dirname, '.cache', 'puppeteer'),
    },
  });

  whatsapp.stderr.on('data', (data) => {
    const errStr = data.toString();
    process.stderr.write(errStr);
    try { fs.appendFileSync(logPath, errStr); } catch (_) {}
  });

  whatsapp.on('close', (code) => {
    console.log(`[Startup Orchestrator] WhatsApp service exited with code ${code}. Restarting in 10s...`);
    // Auto-restart the WhatsApp service after a crash — NEVER kill Next.js for this
    setTimeout(spawnWhatsApp, 10000);
  });

  whatsapp.on('error', (err) => {
    console.error('[Startup Orchestrator] WhatsApp spawn error:', err.message);
    setTimeout(spawnWhatsApp, 10000);
  });

  return whatsapp;
}

spawnWhatsApp();

// ─── 2. Next.js Production Server ─────────────────────────────────────────────
const port = process.env.PORT || 10000;
const nextPath = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log(`[Startup Orchestrator] Spawning Next.js on 0.0.0.0:${port}...`);

const next = spawn('node', ['--max-old-space-size=384', nextPath, 'start', '-H', '0.0.0.0', '-p', port.toString()], {
  stdio: 'inherit',
  shell: false,
  env: {
    ...process.env,
    // Limit Next.js worker count to avoid OOM on Render's free tier (512MB RAM)
    UV_THREADPOOL_SIZE: '4',
  },
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
const killAll = () => {
  console.log('[Startup Orchestrator] Shutting down...');
  process.exit(0);
};

process.on('SIGINT', killAll);
process.on('SIGTERM', killAll);

// If Next.js dies the whole container should restart (502 from Render means Next.js is down)
next.on('close', (code) => {
  console.log(`[Startup Orchestrator] Next.js exited with code ${code}. Container will restart.`);
  process.exit(1); // Non-zero exit triggers Render container restart
});

next.on('error', (err) => {
  console.error('[Startup Orchestrator] Next.js spawn error:', err.message);
  process.exit(1);
});
