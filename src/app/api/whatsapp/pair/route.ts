import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();
    if (!phoneNumber) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    const serviceUrl = process.env.WHATSAPP_SERVICE_URL || 'http://127.0.0.1:3001';
    const res = await fetch(`${serviceUrl}/api/pair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber })
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to request pairing code from WhatsApp service: ${errText}`);
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
