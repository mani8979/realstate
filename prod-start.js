/**
 * prod-start.js — Render deployment orchestrator
 * ─────────────────────────────────────────────────────────────────────────────
 * Memory budget (Render free tier = 512 MB total):
 *   orchestrator + WA node (In-Process!) ~90 MB  (consolidated!)
 *   Next.js child process                ~180 MB (capped at 200 MB via --max-old-space-size)
 *   Chrome browser process               ~150 MB
 *   ─────────────────────────────────────────────────────────────────
 *   TOTAL                                ~420 MB (safe margin under 512 MB)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const { spawn } = require('child_process');
const path      = require('path');
const fs        = require('fs');

console.log('[Orchestrator] Starting production environment...');

// ── Global uncaught exception handlers to make orchestrator crash-proof ───────
process.on('uncaughtException', (err) => {
  console.error('[Orchestrator CRITICAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Orchestrator CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

// ── Server log path (Next.js status endpoint reads this if offline) ────────────
const logPath = path.join(__dirname, 'whatsapp_server.log');

// ── Safe global console overrides to capture all logs in whatsapp_server.log ──
const originalLog   = console.log;
const originalError = console.error;

function appendToLog(prefix, args) {
  try {
    const msg = args.map(arg => {
      if (arg instanceof Error) return arg.stack;
      return typeof arg === 'object' ? JSON.stringify(arg) : arg;
    }).join(' ');
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] [${prefix}] ${msg}\n`);
  } catch (_) {}
}

console.log = function (...args) {
  appendToLog('LOG', args);
  originalLog.apply(console, args);
};

console.error = function (...args) {
  appendToLog('ERROR', args);
  originalError.apply(console, args);
};

// ── Shared Puppeteer cache path (must match Dockerfile ENV) ───────────────────
const PUPPETEER_CACHE_DIR =
  process.env.PUPPETEER_CACHE_DIR || path.join(__dirname, '.cache', 'puppeteer');
process.env.PUPPETEER_CACHE_DIR = PUPPETEER_CACHE_DIR;
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

// ─────────────────────────────────────────────────────────────────────────────
// 1. Next.js production server
//    This is the main service — if it dies, exit so Render restarts container
// ─────────────────────────────────────────────────────────────────────────────
const port     = process.env.PORT || 10000;
const nextBin  = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

console.log(`[Orchestrator] Spawning Next.js on 0.0.0.0:${port}...`);

const nextProcess = spawn(
  'node',
  [
    '--max-old-space-size=220', // Node V8 heap cap for Next.js
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
      UV_THREADPOOL_SIZE: '4', // Limit libuv thread pool to save memory
    },
  }
);

nextProcess.on('error', (err) => {
  console.error('[Orchestrator] Next.js spawn error:', err.message);
  process.exit(1); // Trigger Render container restart
});

nextProcess.on('close', (code) => {
  console.log(`[Orchestrator] Next.js server exited (code=${code}). Restarting container.`);
  process.exit(code || 1);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Start WhatsApp service IN-PROCESS
//    We load the service directly in-process after a 5 second delay to let
//    Next.js fully bind to port 10000 and pass Render's health checks.
// ─────────────────────────────────────────────────────────────────────────────
function startInProcessWhatsApp() {
  console.log('[Orchestrator] Initializing WhatsApp service in-process (Saving Node process RAM)...');
  try {
    // Load the express app and whatsapp client inside the current node process
    require('./whatsapp-service.js');
    console.log('[Orchestrator] WhatsApp service loaded in-process successfully.');
  } catch (err) {
    console.error('[Orchestrator] Error loading WhatsApp service in-process:', err);
  }
}

// Start WhatsApp after 90 seconds (gives Next.js ample time to pass Render's initial boot health checks cleanly)
setTimeout(startInProcessWhatsApp, 90000);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Graceful shutdown
// ─────────────────────────────────────────────────────────────────────────────
function shutdown() {
  console.log('[Orchestrator] Gracefully shutting down services...');
  try { if (nextProcess) nextProcess.kill(); } catch (_) {}
  process.exit(0);
}

process.on('SIGINT',  shutdown);
process.on('SIGTERM', shutdown);
