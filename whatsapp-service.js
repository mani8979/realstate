const express = require('express');
const QRCode = require('qrcode');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');
const path = require('path');

// Synchronize Puppeteer Cache Directory locally
process.env.PUPPETEER_CACHE_DIR = path.join(__dirname, '.cache', 'puppeteer');

const app = express();
const PORT = process.env.WHATSAPP_PORT || 3001;

let client = null;
let qrCodeData = null;
let botStatus = 'Starting WhatsApp...';

app.use(express.json());

// ------------------------------
// Helper to register events on a client instance
function setupEvents(clientInstance) {
  clientInstance.on('qr', async (qr) => {
    try {
      qrCodeData = await QRCode.toDataURL(qr);
      botStatus = 'Scan the QR code with WhatsApp';
      console.log('[WhatsApp Service] New QR Code generated successfully.');
    } catch (err) {
      console.error('[WhatsApp Service] Error generating QR code URL:', err);
      botStatus = 'Error generating QR code';
    }
  });

  clientInstance.on('authenticated', () => {
    qrCodeData = null; // Hide QR code immediately upon scan success!
    botStatus = 'Authenticated. Synchronizing chats...';
    console.log('[WhatsApp Service] Client is AUTHENTICATED!');
  });

  clientInstance.on('loading_screen', (percent, message) => {
    qrCodeData = null; // Ensure QR is hidden
    botStatus = `Synchronizing: ${percent}% - ${message}`;
    console.log(`[WhatsApp Service] Loading screen: ${percent}% - ${message}`);
  });

  clientInstance.on('ready', () => {
    qrCodeData = null;
    botStatus = 'WhatsApp is ready';
    console.log('[WhatsApp Service] Client is READY and authenticated!');
  });

  clientInstance.on('auth_failure', (msg) => {
    qrCodeData = null;
    botStatus = 'Authentication failed';
    console.error('[WhatsApp Service] Authentication failed:', msg);
  });

  clientInstance.on('disconnected', (reason) => {
    qrCodeData = null;
    botStatus = `Disconnected: ${reason}`;
    console.log('[WhatsApp Service] Disconnected:', reason);
    // Restart client to get a new QR code
    try {
      clientInstance.destroy().catch(() => {});
    } catch (_) {}
    setTimeout(setupClient, 5000);
  });

  clientInstance.on('change_state', (state) => {
    console.log('[WhatsApp Service] State changed to:', state);
  });
}

// WhatsApp Client setup
// ------------------------------
async function setupClient() {
  console.log('[WhatsApp Service] Initializing client...');
  botStatus = 'Initializing WhatsApp...';
  qrCodeData = null;

  // 1. Define standard, legit Chrome browser options with aggressive low-memory settings (No single-process to ensure ready event fires!)
  const standardOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-features=site-per-process', // Reduces multi-process memory footprint without lockups
      '--disable-site-isolation-trials',     // Disables process isolation trials
      '--disable-extensions',                 // Disables browser extensions to save memory
      '--disable-default-apps',              // Disables default apps
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-blink-features=AutomationControlled',
      '--js-flags=--max-old-space-size=150', // Constrains Chromium V8 RAM usage
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    ]
  };

  let initSuccess = false;

  try {
    console.log('[WhatsApp Service] Attempting to launch with standard, full-featured Puppeteer (Legit Chrome)...');
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: path.join(__dirname, '.wwebjs_auth')
      }),
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      puppeteer: standardOptions
    });

    setupEvents(client);
    await client.initialize();
    initSuccess = true;
    console.log('[WhatsApp Service] Standard Puppeteer initialized successfully!');
  } catch (err) {
    console.error('[WhatsApp Service] Standard Puppeteer failed to initialize:', err.message);
  }

  // 2. If standard Puppeteer failed, fall back to @sparticuz/chromium (headless shell)
  if (!initSuccess) {
    console.log('[WhatsApp Service] Falling back to @sparticuz/chromium (headless shell)...');
    try {
      if (client) {
        try { await client.destroy().catch(() => {}); } catch (_) {}
      }

      const chromium = require('@sparticuz/chromium');
      const fallbackOptions = {
        executablePath: await chromium.executablePath(),
        args: [
          ...chromium.args,
          '--disable-features=site-per-process',
          '--disable-site-isolation-trials',
          '--disable-extensions',
          '--disable-default-apps',
          '--disable-blink-features=AutomationControlled',
          '--js-flags=--max-old-space-size=150',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        ],
        headless: chromium.headless
      };

      client = new Client({
        authStrategy: new LocalAuth({
          dataPath: path.join(__dirname, '.wwebjs_auth')
        }),
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        puppeteer: fallbackOptions
      });

      setupEvents(client);
      await client.initialize();
      console.log('[WhatsApp Service] @sparticuz/chromium initialized successfully!');
    } catch (fallbackErr) {
      console.error('[WhatsApp Service] Critical failure: both standard and fallback clients failed to initialize:', fallbackErr.message);
      botStatus = 'Initialization failed';
    }
  }
}

// ------------------------------
// API Routes
// ------------------------------

// 1. Get status and QR
app.get('/api/status', (req, res) => {
  res.json({
    status: botStatus,
    qr: qrCodeData
  });
});

// 2. Logout and clear session
app.post('/api/logout', async (req, res) => {
  console.log('[WhatsApp Service] Received logout request');
  try {
    if (client) {
      botStatus = 'Logging out...';
      try {
        await client.logout();
      } catch (err) {
        console.warn('[WhatsApp Service] Native logout failed (probably already offline):', err.message);
      }
      try {
        await client.destroy();
      } catch (err) {
        console.warn('[WhatsApp Service] Native destroy failed:', err.message);
      }
    }
    
    // Explicitly delete session directory to guarantee fresh login QR
    const sessionDir = path.join(__dirname, '.wwebjs_auth');
    if (fs.existsSync(sessionDir)) {
      try {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('[WhatsApp Service] Cleaned session directory.');
      } catch (dirErr) {
        console.error('[WhatsApp Service] Failed to clean session directory:', dirErr);
      }
    }

    // Re-initialize client
    setTimeout(setupClient, 2000);

    res.json({
      success: true,
      message: 'Successfully logged out and session cleared. Generating a new QR code...'
    });
  } catch (error) {
    console.error('[WhatsApp Service] Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fully log out. Please check logs.'
    });
  }
});

// 3. Send message
app.post('/api/send', async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!number || !message) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and message are required.'
      });
    }

    if (botStatus !== 'WhatsApp is ready') {
      return res.status(400).json({
        success: false,
        message: 'WhatsApp is not ready. Please connect/scan the QR code first.'
      });
    }

    // Clean customer number
    const cleanNumber = number.replace(/\D/g, '');

    // Support standard 10-digit Indian numbers by adding 91 prefix
    let formattedNumber = cleanNumber;
    if (cleanNumber.length === 10) {
      formattedNumber = `91${cleanNumber}`;
    }

    const customerChatId = `${formattedNumber}@c.us`;

    console.log(`[WhatsApp Service] Sending message to ${customerChatId}...`);
    await client.sendMessage(customerChatId, message);
    console.log(`[WhatsApp Service] Message successfully sent to ${customerChatId}.`);

    return res.json({
      success: true,
      message: 'WhatsApp message sent successfully.'
    });
  } catch (error) {
    console.error('[WhatsApp Service] Failed to send WhatsApp message:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp message. Error: ' + error.message
    });
  }
});

// ------------------------------
// Server Startup
// ------------------------------
app.listen(PORT, () => {
  console.log(`[WhatsApp Service] Running on http://localhost:${PORT}`);
  setupClient();
});
