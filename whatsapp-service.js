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
// WhatsApp Client setup
// ------------------------------
async function setupClient() {
  console.log('[WhatsApp Service] Initializing client...');
  botStatus = 'Initializing WhatsApp...';
  qrCodeData = null;

  const puppeteerOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-blink-features=AutomationControlled',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    ]
  };

  // Safe fallback to @sparticuz/chromium for server environments lacking shared libraries (e.g. Render native Node.js runtime)
  if (process.env.NODE_ENV === 'production' || process.env.RENDER === 'true') {
    try {
      console.log('[WhatsApp Service] Production environment detected. Initializing @sparticuz/chromium...');
      const chromium = require('@sparticuz/chromium');
      puppeteerOptions.executablePath = await chromium.executablePath();
      
      // Merge sparticuz/chromium arguments with our critical bot evasion flags
      const extraArgs = [
        ...chromium.args,
        '--disable-blink-features=AutomationControlled',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      ];
      puppeteerOptions.args = Array.from(new Set(extraArgs));
      puppeteerOptions.headless = chromium.headless;
      console.log('[WhatsApp Service] Statically linked Chromium configured with merged bot-evasion flags.');
    } catch (err) {
      console.warn('[WhatsApp Service] Could not load @sparticuz/chromium, using standard Puppeteer defaults:', err.message);
    }
  }

  client = new Client({
    authStrategy: new LocalAuth({
      dataPath: path.join(__dirname, '.wwebjs_auth')
    }),
    webVersionCache: {
      type: 'none' // Always fetch the absolute latest, live version directly from WhatsApp to bypass local cache version conflicts
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    puppeteer: puppeteerOptions
  });

  client.on('qr', async (qr) => {
    try {
      qrCodeData = await QRCode.toDataURL(qr);
      botStatus = 'Scan the QR code with WhatsApp';
      console.log('[WhatsApp Service] New QR Code generated successfully.');
    } catch (err) {
      console.error('[WhatsApp Service] Error generating QR code URL:', err);
      botStatus = 'Error generating QR code';
    }
  });

  client.on('ready', () => {
    qrCodeData = null;
    botStatus = 'WhatsApp is ready';
    console.log('[WhatsApp Service] Client is READY and authenticated!');
  });

  client.on('auth_failure', (msg) => {
    qrCodeData = null;
    botStatus = 'Authentication failed';
    console.error('[WhatsApp Service] Authentication failed:', msg);
  });

  client.on('disconnected', (reason) => {
    qrCodeData = null;
    botStatus = `Disconnected: ${reason}`;
    console.log('[WhatsApp Service] Disconnected:', reason);
    // Restart client to get a new QR code
    try {
      client.destroy();
    } catch (_) {}
    setTimeout(setupClient, 5000);
  });

  client.on('change_state', (state) => {
    console.log('[WhatsApp Service] State changed to:', state);
  });

  client.initialize().catch((error) => {
    console.error('[WhatsApp Service] Failed to initialize client (Async):', error);
    botStatus = 'Initialization failed';
  });
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
