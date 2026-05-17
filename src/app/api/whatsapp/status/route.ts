import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
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
      const logPath = path.join(process.cwd(), 'whatsapp_error.log');
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
