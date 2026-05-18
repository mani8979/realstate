import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

let serviceLoaded = false;

async function ensureWhatsAppService() {
  if (serviceLoaded) return;
  serviceLoaded = true;

  // Guard to prevent lazy-spawning during static build pre-rendering phase
  const isDev = process.env.NODE_ENV === 'development';
  const isStart = process.env.IS_NEXT_START === 'true';
  if (!isDev && !isStart) {
    console.log('[API status] Bypassing lazy WhatsApp spawn during build phase.');
    serviceLoaded = false;
    return;
  }

  console.log('[API status] Lazily spawning in-process WhatsApp service...');
  try {
    const { createRequire } = await import('module');
    const localRequire = createRequire(process.cwd() + '/package.json');
    localRequire('./whatsapp-service.js');
    console.log('[API status] WhatsApp service spawned successfully!');
  } catch (err: any) {
    console.error('[API status] Failed to spawn WhatsApp service:', err.message);
    serviceLoaded = false;
  }
}

export async function GET() {
  // Ensure the service is loaded on the first active request
  await ensureWhatsAppService();

  try {
    const serviceUrl = process.env.WHATSAPP_SERVICE_URL || 'http://127.0.0.1:3001';
    const res = await fetch(`${serviceUrl}/api/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable caching
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch status from WhatsApp service. HTTP status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    // Read the error log if the service crashed
    let daemonError = '';
    try {
      const fs = require('fs');
      const path = require('path');
      const logPath = path.join(process.cwd(), 'whatsapp_server.log');
      if (fs.existsSync(logPath)) {
        daemonError = fs.readFileSync(logPath, 'utf8');
      }
    } catch (_) {}

    return NextResponse.json(
      { 
        status: 'WhatsApp Service Offline', 
        qr: null, 
        error: daemonError || error.message || 'Background WhatsApp microservice is not responding.'
      }, 
      { status: 200 } // Keep 200 to allow the admin UI to gracefully show "Offline / Start Service" status
    );
  }
}
