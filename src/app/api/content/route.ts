import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SiteContent from '@/lib/models/SiteContent';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await dbConnect();
    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create({});
    }
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    let content = await SiteContent.findOne();
    
    if (content) {
      content = await SiteContent.findByIdAndUpdate(content._id, body, { new: true, runValidators: true });
    } else {
      content = await SiteContent.create(body);
    }
    
    // Trigger revalidation for all major pages and layout
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/properties');
    revalidatePath('/gallery');
    revalidatePath('/join');
    revalidatePath('/contact');
    
    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 });
  }
}

