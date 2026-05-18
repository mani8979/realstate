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

if (global.__whatsappServiceLoaded) {
  console.log('[WA] WhatsApp service already loaded in this process. Skipping duplicate initialization.');
  return;
}
global.__whatsappServiceLoaded = true;

// ── Only load lightweight built-ins at the top ────────────────────────────────
// ── Catch-all exception and promise rejection handlers to make it 100% crash-proof ──
process.on('uncaughtException', (err) => {
  console.error('[WA CRITICAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[WA CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful session persistence on process shutdown
let isGracefulShuttingDown = false;
async function handleGracefulShutdown(signal) {
  if (isGracefulShuttingDown) return;
  isGracefulShuttingDown = true;
  console.log(`[WA] Graceful shutdown triggered via ${signal}. Saving current session to MongoDB...`);
  
  if (client) {
    try {
      console.log('[WA] Destroying active WhatsApp client context...');
      await client.destroy();
      console.log('[WA] WhatsApp client destroyed.');
    } catch (err) {
      console.error('[WA] Error destroying client during shutdown:', err.message);
    }
  }
  
  try {
    await backupSessionToMongo();
  } catch (err) {
    console.error('[WA] Error backing up session during shutdown:', err.message);
  }
  
  console.log('[WA] Graceful session backup finalized. Exiting process.');
  process.exit(0);
}

process.once('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.once('SIGINT', () => handleGracefulShutdown('SIGINT'));

const express = require('express');
const path    = require('path');
const fs      = require('fs');

// ── Monkey-patch Puppeteer launch globally for 100% Stealth & Bot-Detection Bypass ──
try {
  const patchLaunch = (puppeteerModule) => {
    if (!puppeteerModule || !puppeteerModule.launch) return;
    const originalLaunch = puppeteerModule.launch;
    puppeteerModule.launch = async function (opts) {
      console.log('[WA STEALTH] Intercepting puppeteer.launch() to inject bypass scripts...');
      
      // Inject standard stealth flags to args if missing
      if (opts && opts.args) {
        opts.args = [...new Set([...opts.args, 
          '--disable-blink-features=AutomationControlled',
          '--use-gl=angle',
          '--use-angle=swiftshader',
          '--window-size=1280,800'
        ])];
      }
      
      const browser = await originalLaunch.call(puppeteerModule, opts);
      
      browser.on('targetcreated', async (target) => {
        try {
          if (target.type() === 'page') {
            const page = await target.page();
            if (page) {
              console.log('[WA STEALTH] Injecting humanizing finger-print overrides into new page...');
              
              // 1. Set clean Windows 10 User-Agent to bypass Linux-browser scanning blocks
              const cleanUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';
              await page.setUserAgent(cleanUA);
              
              // Enable aggressive request interception to save RAM & CPU ONLY in production (Render Free)
              const isProd = process.env.NODE_ENV === 'production';
              if (isProd) {
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                  const type = req.resourceType();
                  if (['image', 'media', 'font'].includes(type)) {
                    req.abort();
                  } else {
                    req.continue();
                  }
                });
              }
              
              // Enable JavaScript on page
              await page.setJavaScriptEnabled(true);
              
              // Set viewport size
              await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
              
              // Inject bypasses BEFORE any scripts run
              await page.evaluateOnNewDocument(() => {
                const uaStr = navigator.userAgent;
                const isLinux = uaStr.toLowerCase().includes('linux');
                
                // Extract exact Chrome major version to align userAgentData
                const chromeMatch = uaStr.match(/Chrom(?:ium)?\/([0-9]+)\./);
                const chromeVersion = chromeMatch ? chromeMatch[1] : '133';
                
                const platformVal = isLinux ? 'Linux' : 'Windows';
                const rendererVal = isLinux 
                  ? 'Mesa Intel(R) UHD Graphics (CML GT2)' 
                  : 'ANGLE (Intel, Intel(R) UHD Graphics Direct3D11, D3D11)';
                const vendorVal = isLinux ? 'Intel Open Source Technology Center' : 'Google Inc. (Intel)';

                // 1. Hide webdriver property
                Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
                
                // 2. Mock userAgentData to align perfectly with User-Agent OS and Chrome version
                if (navigator.userAgentData) {
                  Object.defineProperty(navigator, 'userAgentData', {
                    get: () => ({
                      brands: [
                        { brand: 'Not(A:Brand', version: '99' },
                        { brand: 'Google Chrome', version: chromeVersion },
                        { brand: 'Chromium', version: chromeVersion }
                      ],
                      mobile: false,
                      platform: platformVal
                    })
                  });
                }
                
                // 3. Populate plugins (mimic real Chrome)
                const mockPlugins = [
                  { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format' },
                  { name: 'Chrome PDF Viewer', filename: 'mhjfbmdlmjbgihfiocmenkejgajgjnib', description: 'Google Chrome PDF Viewer' }
                ];
                Object.defineProperty(navigator, 'plugins', { get: () => mockPlugins });
                
                // 4. Populate languages
                Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
                
                // 5. Mock Chrome object
                window.chrome = {
                  app: {
                    isInstalled: false,
                    InstallState: { DISABLED: 'disabled', INSTALLED: 'installed', NOT_INSTALLED: 'not_installed' },
                    RunningState: { CAN_RUN: 'can_run', CANNOT_RUN: 'cannot_run', RUNNING: 'running' }
                  },
                  runtime: {
                    OnInstalledReason: { INSTALL: 'install', UPDATE: 'update', CHROME_UPDATE: 'chrome_update', SHARED_MODULE_UPDATE: 'shared_module_update' },
                    OnRestartRequiredReason: { APP_UPDATE: 'app_update', OS_UPDATE: 'os_update', PERIODIC: 'periodic' },
                    PlatformArch: { ARM: 'arm', ARM64: 'arm64', X86_32: 'x86-32', X86_64: 'x86-64', MIPS: 'mips', MIPS64: 'mips64' },
                    PlatformNaclArch: { ARM: 'arm', ARM64: 'arm64', X86_32: 'x86-32', X86_64: 'x86-64', MIPS: 'mips', MIPS64: 'mips64' },
                    PlatformOs: { MAC: 'mac', WIN: 'win', ANDROID: 'android', CROS: 'cros', LINUX: 'linux', OPENBSD: 'openbsd' },
                    RequestUpdateCheckStatus: { THROTTLED: 'throttled', NO_UPDATE: 'no_update', UPDATE_AVAILABLE: 'update_available' }
                  }
                };
                
                // 6. WebGL Vendor & Renderer spoofing (OS aligned - handles WebGL, experimental, and WebGL2)
                const originalGetContext = HTMLCanvasElement.prototype.getContext;
                HTMLCanvasElement.prototype.getContext = function (type, attributes) {
                  const context = originalGetContext.apply(this, arguments);
                  if (context && (type === 'webgl' || type === 'experimental-webgl' || type === 'webgl2')) {
                    const gl = context;
                    const originalGetParameter = gl.getParameter;
                    gl.getParameter = function (pname) {
                      if (pname === 37445) return vendorVal; // UNMASKED_VENDOR_WEBGL
                      if (pname === 37446) return rendererVal; // UNMASKED_RENDERER_WEBGL
                      return originalGetParameter.apply(this, arguments);
                    };
                  }
                  return context;
                };
              });
            }
          }
        } catch (err) {
          console.error('[WA STEALTH ERROR] Target creation hook failed:', err.message);
        }
      });
      
      return browser;
    };
  };

  try { patchLaunch(require('puppeteer-core')); } catch (_) {}
  try { patchLaunch(require('puppeteer')); } catch (_) {}
} catch (e) {
  console.error('[WA STEALTH] Failed to initialize global launcher hooks:', e.message);
}
const os      = require('os');
const { execSync } = require('child_process');

const app  = express();
const PORT = process.env.WHATSAPP_PORT || 3001;

// ── MONGODB SESSION PERSISTENCE HELPERS ──────────────────────────────────────
async function backupSessionToMongo() {
  const sessionDir = path.join(__dirname, '.wwebjs_auth');
  if (!fs.existsSync(sessionDir)) {
    console.log('[WA] No session directory found to backup.');
    return;
  }
  
  // Clean non-essential folders to shrink package size before compression
  const cleanList = [
    'session/Default/Cache',
    'session/Default/Code Cache',
    'session/Default/GPUCache',
    'session/Default/Service Worker',
    'session/Default/IndexedDB/https_web.whatsapp.com_0.indexeddb.blob',
    'session/BrowserMetrics-spare.pma',
    'session/Crashpad'
  ];
  for (const f of cleanList) {
    const fullPath = path.join(sessionDir, f);
    try {
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`[WA] Purged non-essential cache folder: ${f}`);
      }
    } catch (_) {}
  }
  
  const tempFile = path.join(os.tmpdir(), 'wa_session.tar.gz');
  try {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    
    console.log(`[WA] Archiving session folder from ${sessionDir} to ${tempFile}...`);
    execSync(`tar -czf "${tempFile}" -C "${sessionDir}" .`, { stdio: 'ignore' });
    
    if (!fs.existsSync(tempFile)) {
      throw new Error('Tar archive creation failed.');
    }
    
    const archiveBuffer = fs.readFileSync(tempFile);
    console.log(`[WA] Session archived. Size: ${archiveBuffer.length} bytes.`);
    
    const mongoose = require('mongoose');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('[WA] MONGODB_URI not found in env. Skipping MongoDB backup.');
      return;
    }
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }
    
    const collection = mongoose.connection.collection('whatsapp_sessions');
    await collection.updateOne(
      { key: 'session_archive' },
      { $set: { data: archiveBuffer, updatedAt: new Date() } }, // Save raw Binary Buffer directly (33% smaller than base64!)
      { upsert: true }
    );
    console.log('[WA] ✅ Session successfully backed up to MongoDB.');
  } catch (e) {
    console.error('[WA] Failed to backup session to MongoDB:', e.message);
  } finally {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (_) {}
  }
}

async function restoreSessionFromMongo() {
  const sessionDir = path.join(__dirname, '.wwebjs_auth');
  const tempFile = path.join(os.tmpdir(), 'wa_session.tar.gz');
  
  try {
    const mongoose = require('mongoose');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('[WA] MONGODB_URI not found. Skipping MongoDB restore.');
      return false;
    }
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }
    
    const collection = mongoose.connection.collection('whatsapp_sessions');
    const doc = await collection.findOne({ key: 'session_archive' });
    if (!doc || !doc.data) {
      console.log('[WA] No backed-up session found in MongoDB.');
      return false;
    }
    
    console.log('[WA] Backed-up session found in MongoDB. Restoring...');
    
    let archiveBuffer;
    if (Buffer.isBuffer(doc.data)) {
      archiveBuffer = doc.data;
    } else if (doc.data && doc.data.buffer && Buffer.isBuffer(doc.data.buffer)) {
      archiveBuffer = doc.data.buffer;
    } else if (typeof doc.data === 'string') {
      archiveBuffer = Buffer.from(doc.data, 'base64');
    } else {
      archiveBuffer = Buffer.from(doc.data);
    }
    
    fs.writeFileSync(tempFile, archiveBuffer);
    
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
    }
    fs.mkdirSync(sessionDir, { recursive: true });
    
    execSync(`tar -xzf "${tempFile}" -C "${sessionDir}"`, { stdio: 'ignore' });
    console.log('[WA] ✅ Session successfully restored from MongoDB.');
    return true;
  } catch (e) {
    console.error('[WA] Failed to restore session from MongoDB:', e.message);
    return false;
  } finally {
    try {
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (_) {}
  }
}

async function deleteSessionFromMongo() {
  try {
    const mongoose = require('mongoose');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) return;
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }
    
    const collection = mongoose.connection.collection('whatsapp_sessions');
    await collection.deleteOne({ key: 'session_archive' });
    console.log('[WA] Deleted session archive from MongoDB.');
  } catch (e) {
    console.error('[WA] Failed to delete session from MongoDB:', e.message);
  }
}

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

// ── Safe Background Client Destruction Utility to Prevent Deadlocks ──────────
function destroyClientSafe(oldClient) {
  if (!oldClient) return;
  console.log('[WA] Safely destroying old client in the background (fire-and-forget)...');
  // Race client.destroy against a 4-second hard timeout to guarantee execution flow never deadlocks
  Promise.race([
    oldClient.destroy().catch(() => {}),
    new Promise(resolve => setTimeout(resolve, 4000))
  ]).catch(() => {});
}

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
    try { await client.logout().catch(() => {}); } catch (_) {}
    destroyClientSafe(client);
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

  // Clear remote MongoDB backup
  await deleteSessionFromMongo();

  retryTimer = setTimeout(setupClient, 2000);
  res.json({ success: true, message: 'Session cleared. New QR incoming...' });
});

app.post('/api/pair', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'phoneNumber is required' });
  }

  if (!client) {
    return res.status(553).json({ success: false, message: 'WhatsApp client is not initialized' });
  }

  try {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    console.log(`[WA] Requesting pairing code for number: ${cleanNumber}`);
    const pairingCode = await client.requestPairingCode(cleanNumber);
    console.log(`[WA] Generated pairing code successfully: ${pairingCode}`);
    return res.json({ success: true, pairingCode });
  } catch (e) {
    console.error('[WA] Failed to generate pairing code:', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.get('/api/screenshot', async (req, res) => {
  if (!client || !client.pupPage) {
    return res.status(503).json({ success: false, message: 'Browser page is not available' });
  }

  try {
    console.log('[WA] Capturing debug screenshot of the browser page...');
    const screenshotBuffer = await client.pupPage.screenshot({ type: 'png' });
    res.setHeader('Content-Type', 'image/png');
    return res.send(screenshotBuffer);
  } catch (e) {
    console.error('[WA] Screenshot capture failed:', e.message);
    return res.status(500).json({ success: false, message: e.message });
  }
});

app.post('/api/send', async (req, res) => {
  const { number, message } = req.body;
  if (!number || !message)
    return res.status(400).json({ success: false, message: 'number and message required' });

  const isServiceActive = 
    botStatus === 'WhatsApp is ready' || 
    botStatus === 'Authenticated — syncing chats...' || 
    (botStatus && botStatus.startsWith('Syncing:'));

  if (!isServiceActive)
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
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WA] HTTP server ready on port ${PORT}`);
  // Delay Chrome launch slightly so the process settles
  retryTimer = setTimeout(setupClient, 2000);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`[WA] Port ${PORT} is already in use. This instance will not run a duplicate WhatsApp client.`);
  } else {
    console.error('[WA] Express server error:', err);
  }
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
    // Monkey-patch Puppeteer utility in whatsapp-web.js to bypass the "window is not defined" crash
    try {
      const PuppeteerUtils = require('whatsapp-web.js/src/util/Puppeteer');
      if (PuppeteerUtils && PuppeteerUtils.exposeFunctionIfAbsent) {
        const originalExpose = PuppeteerUtils.exposeFunctionIfAbsent;
        PuppeteerUtils.exposeFunctionIfAbsent = async function(page, name, fn) {
          if (name === 'onAuthAppStateChangedEvent') {
            console.log('[WA PATCH] Injecting safe wrapper for onAuthAppStateChangedEvent to fix "window is not defined" crash');
            const originalFn = fn;
            fn = async function(state) {
              if (state === 'UNPAIRED_IDLE') {
                console.log('[WA PATCH] Intercepted UNPAIRED_IDLE state change. Executing refreshQR safely inside page context...');
                await page.evaluate(() => {
                  try {
                    window.require('WAWebCmd').Cmd.refreshQR();
                  } catch (err) {
                    console.error('[WA PATCH] Failed to refresh QR in page:', err.message);
                  }
                }).catch(() => {});
                return;
              }
              try {
                return await originalFn(state);
              } catch (err) {
                if (err.message && err.message.includes('window is not defined')) {
                  console.log('[WA PATCH] Suppressed window is not defined error in onAuthAppStateChangedEvent');
                  return;
                }
                throw err;
              }
            };
          }
          return originalExpose.call(this, page, name, fn);
        };
        console.log('[WA PATCH] Successfully registered whatsapp-web.js exposed function interceptor!');
      }
    } catch (patchErr) {
      console.error('[WA PATCH ERROR] Failed to patch whatsapp-web.js exposeFunction:', patchErr.message);
    }

    ({ Client, LocalAuth } = require('whatsapp-web.js'));
    QRCode = require('qrcode');
  } catch (e) {
    console.error('[WA] Failed to require packages:', e.message);
    botStatus    = 'Package load failed — retrying in 10s';
    initializing = false;
    retryTimer   = setTimeout(setupClient, 10000);
    return;
  }

  // ── Restore session from MongoDB BEFORE initializing client ────────────────
  const authDir = path.join(__dirname, '.wwebjs_auth');
  
  // On localhost, we bypass restoring the production session on boot to guarantee instant, clean QR codes!
  const isRender = !!process.env.RENDER;
  let hasBackup = false;
  
  if (isRender) {
    try {
      const mongoose = require('mongoose');
      const mongoUri = process.env.MONGODB_URI;
      if (mongoUri) {
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(mongoUri);
        }
        const collection = mongoose.connection.collection('whatsapp_sessions');
        const doc = await collection.findOne({ key: 'session_archive' });
        if (doc && doc.data) {
          hasBackup = true;
        }
      }
    } catch (e) {
      console.error('[WA] MongoDB backup check failed:', e.message);
    }
  }

  if (hasBackup) {
    console.log('[WA] Verified backup exists in MongoDB. Restoring to ensure fresh and clean state...');
    await restoreSessionFromMongo();
  } else {
    console.log('[WA] Starting clean QR scan session, purging dirty leftover files...');
    try {
      if (fs.existsSync(authDir)) {
        fs.rmSync(authDir, { recursive: true, force: true });
        console.log('[WA] Successfully purged dirty session directory.');
      }
    } catch (err) {
      console.error('[WA] Failed to clear dirty session directory:', err.message);
    }
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
    destroyClientSafe(client);
    client = null;
  }

  // ── Resolve Chrome executable via robust recursive scanner ──────────────────
  function findChromeBinary() {
    if (process.platform === 'win32') {
      return null; // Let Puppeteer resolve its own local Chrome binary instantly on Windows!
    }
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
  let customArgs = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',       // use /tmp — critical in Docker
    '--disable-gpu',                  // disable GPU processing — great for cloud containers
    '--disable-blink-features=AutomationControlled', // remove navigator.webdriver flag to avoid detection
    '--js-flags=--max-old-space-size=180', // Cap V8 heap memory inside headless Chrome to 180MB (increased to support heavy chat synchronization without crashes)
    '--disable-extensions',
    '--disable-component-extensions-with-background-pages',
    '--disable-default-apps',
    '--mute-audio',
    '--disable-backgrounding-occluded-windows', // Prevent Chromium from freezing occluded background tabs (critical for headless sync!)
    '--disable-renderer-backgrounding',        // Keep rendering active in headless mode
    '--disable-background-timer-throttling',   // Avoid throttling background setTimeout/setInterval timers
    '--disk-cache-size=0',                     // Disable disk cache to prevent filesystem writes slowing down the container
    '--media-cache-size=0',                    // Disable media cache
  ];

  // ── Integrate @sparticuz/chromium on Linux (Render native mode support!) ───
  if (process.platform === 'linux' && !executablePath) {
    try {
      console.log('[WA] Linux platform detected. Loading self-contained @sparticuz/chromium...');
      const chromium = require('@sparticuz/chromium');
      
      const sparticuzPath = await chromium.executablePath();
      if (sparticuzPath) {
        executablePath = sparticuzPath;
        console.log('[WA] Successfully loaded @sparticuz/chromium at:', executablePath);
        
        // Merge sparticuz optimized low-memory args with our custom args
        customArgs = [...new Set([...chromium.args, ...customArgs])];
      }
    } catch (err) {
      console.error('[WA] Failed to load @sparticuz/chromium, falling back to local Chrome scanner:', err.message);
    }
  }

  const customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36';

  const puppeteerOpts = {
    headless: true,
    args: customArgs,
    ...(executablePath ? { executablePath } : {}),
  };

  // ── Create client ───────────────────────────────────────────────────────────
  try {
    client = new Client({
      authStrategy: new LocalAuth({ dataPath: path.join(__dirname, '.wwebjs_auth') }),
      puppeteer: puppeteerOpts,
      userAgent: customUserAgent,
      qrTimeoutMs: 360000,   // Extend QR code expiration timeout to 6 minutes (prevents loops on slow container syncs!)
      authTimeoutMs: 360000, // Extend Auth timeout to 6 minutes
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
    
    // Backup session immediately on authentication!
    setTimeout(backupSessionToMongo, 5000);
  });

  client.on('loading_screen', (pct, msg) => {
    qrCodeData = null;
    botStatus  = `Syncing: ${pct}% — ${msg}`;
    console.log(`[WA] Loading ${pct}% — ${msg}`);
  });

  client.on('ready', async () => {
    qrCodeData   = null;
    botStatus    = 'WhatsApp is ready';
    initializing = false;
    console.log('[WA] ✅ Client READY');
    
    // Backup session to MongoDB!
    await backupSessionToMongo();
    
    // Schedule additional backups at 30 seconds and 3 minutes to capture any initial syncing database updates
    setTimeout(backupSessionToMongo, 30000);
    setTimeout(backupSessionToMongo, 180000);
  });

  client.on('auth_failure', async (msg) => {
    qrCodeData   = null;
    botStatus    = 'Auth failed — clearing session...';
    initializing = false;
    console.error('[WA] Auth failure:', msg);
    
    if (client) {
      destroyClientSafe(client);
      client = null;
    }

    const sessionDir = path.join(__dirname, '.wwebjs_auth');
    try {
      if (fs.existsSync(sessionDir)) {
        fs.rmSync(sessionDir, { recursive: true, force: true });
        console.log('[WA] Cleaned up session directory after auth_failure');
      }
    } catch (e) {
      console.error('[WA] Failed to clear session after auth_failure:', e.message);
    }

    // Delete invalid session from MongoDB
    await deleteSessionFromMongo();

    console.log('[WA] Scheduling client re-initialization in 10 seconds...');
    clearTimeout(retryTimer);
    retryTimer = setTimeout(setupClient, 10000);
  });

  client.on('disconnected', async (reason) => {
    qrCodeData   = null;
    botStatus    = `Disconnected (${reason}) — reconnecting...`;
    initializing = false;
    console.log('[WA] Disconnected:', reason);
    
    // Gracefully destroy the client and schedule a retry without crashing the entire Next.js parent process
    if (client) {
      destroyClientSafe(client);
      client = null;
    }

    if (reason === 'forced-logout') {
      const sessionDir = path.join(__dirname, '.wwebjs_auth');
      try {
        if (fs.existsSync(sessionDir)) {
          fs.rmSync(sessionDir, { recursive: true, force: true });
          console.log('[WA] Cleaned up session directory after forced-logout');
        }
      } catch (e) {
        console.error('[WA] Failed to clear session after disconnect:', e.message);
      }

      // Delete invalid session from MongoDB too
      await deleteSessionFromMongo();
    }

    console.log('[WA] Scheduling client re-initialization in 5 seconds...');
    clearTimeout(retryTimer);
    retryTimer = setTimeout(setupClient, 5000);
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
    destroyClientSafe(client);
    client     = null;
    retryTimer = setTimeout(setupClient, 15000);
  }
}

// Trigger automatic deployment webhook: WhatsApp Session is now fully synchronized in MongoDB!
