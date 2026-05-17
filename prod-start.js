/**
 * prod-start.js — Render deployment orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * Memory budget (Render free tier = 512 MB total):
 *   orchestrator  ~20 MB
 *   Next.js       ~150 MB  (capped at 180 MB via --max-old-space-size)
 *   WA Node       ~70  MB  (capped at 128 MB via --max-old-space-size)
 *   Chrome        ~150 MB  (capped at 96 MB V8 heap inside wwebjs args)
 *   ─────────────────────────────────────────────────────────────────
 *   TOTAL         ~390 MB  (safe margin under 512 MB)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const { spawn } = require('child_process');
const path      = require('path');
const fs        = require('fs');

console.log('[Orchestrator] Starting...');

// ── Error log ─────────────────────────────────────────────────────────────────
const logPath = path.join(__dirname, 'whatsapp_error.log');
try { if (fs.existsSync(logPath)) fs.unlinkSync(logPath); } catch (_) {}

// ── Shared Puppeteer cache path (must match Dockerfile ENV) ───────────────────
const PUPPETEER_CACHE_DIR =
  process.env.PUPPETEER_CACHE_DIR || path.join(__dirname, '.cache', 'puppeteer');

// ─────────────────────────────────────────────────────────────────────────────
// 1. WhatsApp background service
//    Crashes are caught and auto-restarted — NEVER affect Next.js / port 10000
// ─────────────────────────────────────────────────────────────────────────────
const whatsappPath = path.join(__dirname, 'whatsapp-service.js');
let waProcess = null;
let waRestartCount = 0;

function spawnWhatsApp() {
  waRestartCount++;
  console.log(`[Orchestrator] Spawning WhatsApp service (attempt #${waRestartCount})...`);

  waProcess = spawn(
    'node',
    [
      '--max-old-space-size=128', // Node V8 heap cap for the WA process
      whatsappPath,
    ],
    {
      stdio: ['inherit', 'inherit', 'pipe'],
      shell: false,
      env: {
        ...process.env,
        PUPPETEER_CACHE_DIR,
        // Suppress Puppeteer's noisy "Downloading Chrome..." messages
        PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
      },
    }
  );

  // Pipe stderr to our error log AND to Render's log stream
  waProcess.stderr.on('data', (data) => {
    const str = data.toString();
    process.stderr.write(str);
    try { fs.appendFileSync(logPath, str); } catch (_) {}
  });

  waProcess.on('error', (err) => {
    console.error('[Orchestrator] WhatsApp spawn error:', err.message);
    scheduleWaRestart();
  });

  waProcess.on('close', (code, signal) => {
    console.log(`[Orchestrator] WhatsApp service exited (code=${code} signal=${signal}). Restarting in 3s...`);
    scheduleWaRestart();
  });
}

function scheduleWaRestart() {
  // Back off slightly if crashing very frequently (every restart after 5 uses 10s)
  const delay = waRestartCount > 5 ? 10000 : 3000;
  setTimeout(spawnWhatsApp, delay);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Next.js production server
//    This is the main service — if it dies, exit so Render restarts container
// ─────────────────────────────────────────────────────────────────────────────
const port     = process.env.PORT || 10000;
const nextBin  = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log(`[Orchestrator] Spawning Next.js on 0.0.0.0:${port}...`);

const nextProcess = spawn(
  'node',
  [
    '--max-old-space-size=180', // Node V8 heap cap for Next.js
    nextBin,
    'start',
    '-H', '0.0.0.0',
    '-p', String(port),
  ],
  {
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      // Limit libuv thread pool — reduces idle memory
      UV_THREADPOOL_SIZE: '4',
    },
  }
);

nextProcess.on('error', (err) => {
  console.error('[Orchestrator] Next.js spawn error:', err.message);
  process.exit(1); // trigger Render container restart
});

nextProcess.on('close', (code) => {
  console.log(`[Orchestrator] Next.js exited (code=${code}). Triggering container restart.`);
  process.exit(code || 1);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Start WhatsApp service AFTER Next.js is spawned
// ─────────────────────────────────────────────────────────────────────────────
// Delay WA start by 5 seconds so Next.js can bind to port 10000 first.
// This ensures Render's health check passes before Chrome consumes RAM.
setTimeout(spawnWhatsApp, 5000);

// ─────────────────────────────────────────────────────────────────────────────
// 4. Graceful shutdown
// ─────────────────────────────────────────────────────────────────────────────
function shutdown() {
  console.log('[Orchestrator] Shutting down...');
  try { if (waProcess)      waProcess.kill();    } catch (_) {}
  try { if (nextProcess)    nextProcess.kill();  } catch (_) {}
  process.exit(0);
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);
