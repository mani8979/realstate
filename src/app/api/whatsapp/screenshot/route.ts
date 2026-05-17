import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const serviceUrl = process.env.WHATSAPP_SERVICE_URL || 'http://127.0.0.1:3001';
    const res = await fetch(`${serviceUrl}/api/screenshot`, {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Failed to capture screenshot. Status: ${res.status}`);
    }

    const imageBuffer = await res.arrayBuffer();
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'Could not capture WhatsApp browser screenshot: ' + error.message 
      }, 
      { status: 500 }
    );
  }
}
