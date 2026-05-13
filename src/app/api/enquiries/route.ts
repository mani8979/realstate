import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';

export async function GET() {
  try {
    await dbConnect();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const enquiry = await Enquiry.create(data);

    // Send Telegram Notification
    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const isSiteVisit = data.type === 'Site Visit';
      const header = isSiteVisit ? '🚀 *New Site Visit Booking* 🚀' : '📧 *New Website Enquiry* 📧';
      const message = `${header}\n\n👤 *Name:* ${data.name}\n📞 *Phone:* ${data.phone}\n🏢 *Land/Property:* ${data.landInfo || 'Not specified'}\n💬 *Message:* ${data.message || 'No message'}\n🔗 *Type:* ${data.type || 'General Enquiry'}`;
      
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          })
        });
      } catch (tgError) {
        console.error('Telegram notification failed:', tgError);
      }
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
