/**
 * whatsapp-service.js
 * ─────────────────────────────────────────────────────────────────────────────
 * ARCHITECTURE:
 *   1. HTTP server starts IMMEDIATELY (< 100ms) — port 3001 is always reachable.
 *   2. whatsapp-web.js and Chrome are loaded LAZILY inside setupClient().
 *   3. Any crash auto-restarts in 3 seconds; HTTP server never goes down.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ── Only load lightweight built-ins at the top ────────────────────────────────
// ── Catch-all exception and promise rejection handlers to make it 100% crash-proof ──
process.on('uncaughtException', (err) => {
  console.error('[WA CRITICAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[WA CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const express = require('express');
const path    = require('path');
const fs      = require('fs');

const app  = express();
const PORT = process.env.WHATSAPP_PORT || 3001;

// ── Puppeteer cache: must match what the Dockerfile bakes in ──────────────────
const CACHE_DIR = process.env.PUPPETEER_CACHE_DIR
  || path.join(__dirname, '.cache', 'puppeteer');
process.env.PUPPETEER_CACHE_DIR = CACHE_DIR;

// ── Shared state ──────────────────────────────────────────────────────────────
let client       = null;
let qrCodeData   = null;
let botStatus    = 'Starting WhatsApp service...';
let initializing = false;
let retryTimer   = null;

app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// API ROUTES — registered before app.listen so they are always available
// ─────────────────────────────────────────────────────────────────────────────

app.get('/api/status', (_req, res) => {
  res.json({ status: botStatus, qr: qrCodeData });
});

app.post('/api/logout', async (_req, res) => {
  console.log('[WA] Logout requested');
  clearTimeout(retryTimer);
  initializing = false;

  if (client) {
    try { await client.logout();  } catch (_) {}
    try { await client.destroy(); } catch (_) {}
    client = null;
  }

  const sessionDir = path.join(__dirname, '.wwebjs_auth');
  try {
    if (fs.existsSync(sessionDir))
      fs.rmSync(sessionDir, { recursive: true, force: true });
    console.log('[WA] Session directory cleared');
  } catch (e) {
    console.error('[WA] Could not clear session dir:', e.message);
  }

  retryTimer = setTimeout(setupClient, 2000);
  res.json({ success: true, message: 'Session cleared. New QR incoming...' });
});

app.post('/api/send', async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message)
    return res.status(400).json({ success: false, message: 'number and message required' });

  if (botStatus !== 'WhatsApp is ready')
    return res.status(503).json({ success: false, message: `Not ready: ${botStatus}` });

  try {
    const clean    = number.replace(/\D/g, '');
    const chatId   = `${clean.length === 10 ? '91' + clean : clean}@c.us`;
    await client.sendMessage(chatId, message);
    console.log(`[WA] Message sent to ${chatId}`);
    return res.json({ success: true, message: 'Sent!' });
  } catch (e) {
    console.error('[WA] Send error:', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// START HTTP SERVER FIRST — before any heavy module loading
// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WA] HTTP server ready on port ${PORT}`);
  // Delay Chrome launch slightly so the process settles
  retryTimer = setTimeout(setupClient, 2000);
});

// ─────────────────────────────────────────────────────────────────────────────
// WHATSAPP CLIENT — loaded lazily here, not at require() time
// ─────────────────────────────────────────────────────────────────────────────
async function setupClient() {
  if (initializing) {
    console.log('[WA] Already initializing — skipping duplicate call');
    return;
  }
  initializing = true;
  clearTimeout(retryTimer);

  console.log('[WA] Loading whatsapp-web.js...');
  botStatus  = 'Initializing...';
  qrCodeData = null;

  // Lazy-require heavy packages HERE (not at module top)
  let Client, LocalAuth, QRCode;
  try {
    ({ Client, LocalAuth } = require('whatsapp-web.js'));
    QRCode = require('qrcode');
  } catch (e) {
    console.error('[WA] Failed to require packages:', e.message);
    botStatus    = 'Package load failed — retrying in 10s';
    initializing = false;
    retryTimer   = setTimeout(setupClient, 10000);
    return;
  }

  // ── Destroy previous client if any ─────────────────────────────────────────
  // ── Clean up any stale Chromium SingletonLock files to prevent hangs ────────
  try {
    const authDir = path.join(__dirname, '.wwebjs_auth');
    const lockPath = path.join(authDir, 'session', 'SingletonLock');
    if (fs.existsSync(lockPath)) {
      console.log('[WA] Found stale Chromium SingletonLock! Deleting to prevent launch hang...');
      fs.unlinkSync(lockPath);
    }
  } catch (err) {
    console.warn('[WA] Warning: Failed to clear SingletonLock:', err.message);
  }

  // ── Destroy previous client if any ─────────────────────────────────────────
  if (client) {
    try { await client.destroy().catch(() => {}); } catch (_) {}
    client = null;
  }

  // ── Resolve Chrome executable via robust recursive scanner ──────────────────
  function findChromeBinary() {
    const cacheDir = process.env.PUPPETEER_CACHE_DIR || path.join(__dirname, '.cache', 'puppeteer');
    console.log('[WA] Scanning cache directory for Chrome:', cacheDir);
    if (!fs.existsSync(cacheDir)) return null;

    function search(dir) {
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            const found = search(fullPath);
            if (found) return found;
          } else {
            const isWin = process.platform === 'win32';
            if (isWin && file === 'chrome.exe') {
              return fullPath;
            }
            if (!isWin && file === 'chrome') {
              return fullPath;
            }
          }
        }
      } catch (_) {}
      return null;
    }
    return search(cacheDir);
  }

  let executablePath = findChromeBinary();
  if (executablePath) {
    console.log('[WA] Found Chrome at:', executablePath);
  } else {
    console.warn('[WA] Chrome binary not found in cache folder!');
  }

  // ── Chromium launch args — minimal, safe, low-memory ───────────────────────
  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',       // use /tmp — critical in Docker
    '--disable-features=Translate,BackForwardCache,AcceptCHFrame,MediaRouter,OptimizationHints,site-per-process', // force frames to share process — stable 70MB+ RAM saver!
    '--blink-settings=imagesEnabled=false', // Disable loading of all images (saves up to 100MB+ RAM!)
    '--disable-gpu',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-client-side-phishing-detection',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-hang-monitor',
    '--disable-popup-blocking',
    '--disable-prompt-on-repost',
    '--disable-sync',
    '--disable-translate',
    '--metrics-recording-only',
    '--no-default-browser-check',
    '--safebrowsing-disable-auto-update',
    '--disable-blink-features=AutomationControlled',
  ];

  const puppeteerOpts = {
    headless: true,
    args,
    ...(executablePath ? { executablePath } : {}),
  };

  // ── Create client ───────────────────────────────────────────────────────────
  try {
    client = new Client({
      authStrategy: new LocalAuth({ dataPath: path.join(__dirname, '.wwebjs_auth') }),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      puppeteer: puppeteerOpts,
    });
  } catch (e) {
    console.error('[WA] new Client() failed:', e.message);
    botStatus    = 'Client creation failed — retrying in 10s';
    initializing = false;
    retryTimer   = setTimeout(setupClient, 10000);
    return;
  }

  // ── Wire events ────────────────────────────────────────────────────────────
  client.on('qr', async (qr) => {
    try {
      qrCodeData = await QRCode.toDataURL(qr);
      botStatus  = 'Scan the QR code with WhatsApp';
      console.log('[WA] QR code ready — waiting for scan...');
    } catch (e) {
      console.error('[WA] QRCode generation error:', e.message);
    }
  });

  client.on('authenticated', () => {
    qrCodeData = null;
    botStatus  = 'Authenticated — syncing chats...';
    console.log('[WA] Authenticated!');
  });

  client.on('loading_screen', (pct, msg) => {
    qrCodeData = null;
    botStatus  = `Syncing: ${pct}% — ${msg}`;
    console.log(`[WA] Loading ${pct}% — ${msg}`);
  });

  client.on('ready', () => {
    qrCodeData   = null;
    botStatus    = 'WhatsApp is ready';
    initializing = false;
    console.log('[WA] ✅ Client READY');
  });

  client.on('auth_failure', (msg) => {
    qrCodeData   = null;
    botStatus    = 'Auth failed — reconnecting in 10s';
    initializing = false;
    console.error('[WA] Auth failure:', msg);
    retryTimer   = setTimeout(setupClient, 10000);
  });

  client.on('disconnected', (reason) => {
    qrCodeData   = null;
    botStatus    = `Disconnected (${reason}) — restarting container...`;
    initializing = false;
    console.log('[WA] Disconnected:', reason);
    
    // Gracefully exit the parent process to trigger a clean container restart on Render
    // This terminates all helper processes, clears any RAM leaks, and re-links with a fresh memory state!
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });

  // ── Initialize (launches Chrome) ───────────────────────────────────────────
  console.log('[WA] Launching Chrome and connecting to WhatsApp Web...');
  botStatus = 'Launching browser...';

  try {
    await client.initialize();
    // 'ready' event sets initializing = false
    console.log('[WA] client.initialize() resolved');
  } catch (e) {
    console.error('[WA] initialize() threw:', e.message);
    botStatus    = 'Browser launch failed — retrying in 15s';
    initializing = false;
    try { client.destroy().catch(() => {}); } catch (_) {}
    client     = null;
    retryTimer = setTimeout(setupClient, 15000);
  }
}
