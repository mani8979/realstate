import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const serviceUrl = process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001';
    const res = await fetch(`${serviceUrl}/api/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to send logout to WhatsApp service. HTTP status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Could not communicate with the background WhatsApp service: ' + error.message 
      }, 
      { status: 500 }
    );
  }
}
