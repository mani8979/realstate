import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';

export async function GET() {
  try {
    await dbConnect();
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(100).lean();
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
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (tgError) {
        console.error('Telegram notification failed:', tgError);
      }
    }

    // Send WhatsApp Notification to Customer
    if (data.phone) {
      try {
        const cleanNumber = data.phone.replace(/\D/g, '');
        // Only send if it looks like a valid 10-digit mobile number
        if (cleanNumber.length === 10) {
          const isSiteVisit = data.type === 'Site Visit';
          
          // Build custom professional message
          const waMessage = isSiteVisit 
            ? `✅ *Site Visit Booking Confirmed!* 🏡\n\nHello *${data.name}*,\n\nThank you for choosing *SN Real Estate*. Your site visit request has been successfully registered!\n\n📋 *Booking Details:*\n👤 *Name:* ${data.name}\n📞 *Mobile:* ${data.phone}\n📍 *Interested Property:* ${data.landInfo || 'Not specified'}\n\nOur team is currently planning your schedule. We will call you shortly to coordinate the visit timings.\n\nHave a great day!\n*SN Real Estate Team* 🚀`
            : `✅ *Enquiry Received!* 📧\n\nHello *${data.name}*,\n\nThank you for reaching out to *SN Real Estate*. We have received your query regarding *${data.landInfo || 'our properties'}*.\n\n💬 *Your Message:* ${data.message || 'No message provided'}\n\nOur team will review your enquiry and get back to you shortly.\n\nBest regards,\n*SN Real Estate Team*`;

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);
          
          await fetch('http://localhost:3001/api/send', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420' // Skip browser warning if accessed from different nodes
            },
            body: JSON.stringify({
              number: cleanNumber,
              message: waMessage
            }),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          console.log('[API Route] Sent WhatsApp notification to customer.');
        }
      } catch (waError: any) {
        console.error('[API Route] WhatsApp notification failed (service might be offline or not logged in):', waError.message);
      }
    }

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
