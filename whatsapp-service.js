const express = require('express');
const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

// ─── Cache Dir ─────────────────────────────────────────────────────────────────
// Must match what the Dockerfile sets and what "npx puppeteer browsers install chrome"
// writes into. Puppeteer reads this env var to locate the downloaded Chrome binary.
const CACHE_DIR = process.env.PUPPETEER_CACHE_DIR || path.join(__dirname, '.cache', 'puppeteer');
process.env.PUPPETEER_CACHE_DIR = CACHE_DIR;

const app = express();
const PORT = process.env.WHATSAPP_PORT || 3001;

let client = null;
let qrCodeData = null;
let botStatus = 'Starting WhatsApp...';
let isInitializing = false;

app.use(express.json());

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Find the Chrome executable that was installed by "npx puppeteer browsers install chrome"
 * inside the Docker image. Returns null if not found (triggers fallback to system Chromium).
 */
function findChromePath() {
  // Puppeteer stores Chrome as: <CACHE_DIR>/chrome/<platform>-<version>/chrome-<platform>/chrome
  const chromePlatformDir = path.join(CACHE_DIR, 'chrome');
  try {
    if (!fs.existsSync(chromePlatformDir)) return null;
    const platforms = fs.readdirSync(chromePlatformDir);
    for (const platform of platforms) {
      // e.g. "linux64-146.0.7680.31"
      const versionDir = path.join(chromePlatformDir, platform);
      const inner = fs.readdirSync(versionDir);
      for (const dir of inner) {
        // e.g. "chrome-linux64"
        const exeDir = path.join(versionDir, dir);
        const candidates = ['chrome', 'chrome-linux', 'google-chrome'];
        for (const exe of candidates) {
          const full = path.join(exeDir, exe);
          if (fs.existsSync(full)) {
            console.log(`[WhatsApp Service] Found Chrome at: ${full}`);
            return full;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[WhatsApp Service] Error scanning Chrome path:', e.message);
  }
  return null;
}

// ─── Events ────────────────────────────────────────────────────────────────────
function setupEvents(clientInstance) {
  clientInstance.on('qr', async (qr) => {
    try {
      qrCodeData = await QRCode.toDataURL(qr);
      botStatus = 'Scan the QR code with WhatsApp';
      console.log('[WhatsApp Service] QR Code generated. Waiting for scan...');
    } catch (err) {
      console.error('[WhatsApp Service] Error generating QR code:', err);
      botStatus = 'Error generating QR code';
    }
  });

  clientInstance.on('authenticated', () => {
    qrCodeData = null;
    botStatus = 'Authenticated. Synchronizing chats...';
    console.log('[WhatsApp Service] Client AUTHENTICATED!');
  });

  clientInstance.on('loading_screen', (percent, message) => {
    qrCodeData = null;
    botStatus = `Synchronizing: ${percent}% — ${message}`;
    console.log(`[WhatsApp Service] Loading: ${percent}% — ${message}`);
  });

  clientInstance.on('ready', () => {
    qrCodeData = null;
    botStatus = 'WhatsApp is ready';
    isInitializing = false;
    console.log('[WhatsApp Service] Client is READY!');
  });

  clientInstance.on('auth_failure', (msg) => {
    qrCodeData = null;
    botStatus = 'Authentication failed';
    isInitializing = false;
    console.error('[WhatsApp Service] Auth failure:', msg);
    // Restart after auth failure
    setTimeout(setupClient, 8000);
  });

  clientInstance.on('disconnected', (reason) => {
    qrCodeData = null;
    botStatus = `Disconnected: ${reason}`;
    isInitializing = false;
    console.log('[WhatsApp Service] Disconnected:', reason);
    try { clientInstance.destroy().catch(() => {}); } catch (_) {}
    setTimeout(setupClient, 5000);
  });

  clientInstance.on('change_state', (state) => {
    console.log('[WhatsApp Service] State:', state);
  });
}

// ─── Client Setup ──────────────────────────────────────────────────────────────
async function setupClient() {
  if (isInitializing) {
    console.log('[WhatsApp Service] Already initializing, skipping duplicate call.');
    return;
  }
  isInitializing = true;

  console.log('[WhatsApp Service] Setting up WhatsApp client...');
  botStatus = 'Initializing WhatsApp...';
  qrCodeData = null;

  // Destroy previous client if it exists
  if (client) {
    try { await client.destroy().catch(() => {}); } catch (_) {}
    client = null;
  }

  // Find the Chrome binary installed at Docker build time
  const executablePath = findChromePath();

  const puppeteerArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',   // use /tmp instead of /dev/shm (critical for Docker)
    '--disable-gpu',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--disable-blink-features=AutomationControlled',
    '--js-flags=--max-old-space-size=200',
  ];

  const puppeteerOptions = {
    headless: true,
    args: puppeteerArgs,
    ...(executablePath ? { executablePath } : {}), // use found Chrome; let Puppeteer auto-find if not found
  };

  console.log('[WhatsApp Service] Chrome executable:', executablePath || '(auto-detect by Puppeteer)');

  try {
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth'),
      }),
      puppeteer: puppeteerOptions,
    });

    setupEvents(client);
    await client.initialize();
    // Note: isInitializing is set to false inside the 'ready' and error handlers
    console.log('[WhatsApp Service] client.initialize() completed successfully.');
  } catch (err) {
    isInitializing = false;
    console.error('[WhatsApp Service] CRITICAL: Failed to initialize client:', err.message);
    botStatus = 'Initialization failed — retrying in 30s';
    // Retry after 30 seconds instead of immediately (gives the container breathing room)
    setTimeout(setupClient, 30000);
  }
}

// ─── API Routes ────────────────────────────────────────────────────────────────

// GET /api/status
app.get('/api/status', (req, res) => {
  res.json({ status: botStatus, qr: qrCodeData });
});

// POST /api/logout — reset session and generate new QR
app.post('/api/logout', async (req, res) => {
  console.log('[WhatsApp Service] Logout requested...');
  isInitializing = false; // allow restart

  try {
    if (client) {
      try { await client.logout(); } catch (_) {}
      try { await client.destroy(); } catch (_) {}
      client = null;
    }

    // Wipe local session data
    const sessionDir = path.join(__dirname, '.wwebjs_auth');
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      console.log('[WhatsApp Service] Session directory cleared.');
    }

    // Re-initialize after a short delay
    setTimeout(setupClient, 2000);

    res.json({ success: true, message: 'Session cleared. New QR will be generated shortly.' });
  } catch (error) {
    console.error('[WhatsApp Service] Logout error:', error);
    res.status(500).json({ success: false, message: 'Logout failed: ' + error.message });
  }
});

// POST /api/send — send a WhatsApp message
app.post('/api/send', async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    return res.status(400).json({ success: false, message: 'number and message are required.' });
  }

  if (botStatus !== 'WhatsApp is ready') {
    return res.status(503).json({ success: false, message: `WhatsApp not ready. Status: ${botStatus}` });
  }

  try {
    const cleanNumber = number.replace(/\D/g, '');
    const formattedNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;
    const chatId = `${formattedNumber}@c.us`;

    console.log(`[WhatsApp Service] Sending message to ${chatId}`);
    await client.sendMessage(chatId, message);
    console.log(`[WhatsApp Service] Message sent to ${chatId}`);

    return res.json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('[WhatsApp Service] Send error:', error);
    return res.status(500).json({ success: false, message: 'Send failed: ' + error.message });
  }
});

// ─── Server Startup ────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WhatsApp Service] HTTP server listening on port ${PORT}`);
  // Give the process a moment to settle before launching Chrome
  setTimeout(setupClient, 1000);
});
