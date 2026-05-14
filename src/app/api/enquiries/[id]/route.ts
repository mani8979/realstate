import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/lib/models/Enquiry';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
    
    if (!deletedEnquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Enquiry deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
