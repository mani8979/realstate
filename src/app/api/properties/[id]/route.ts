import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import { revalidatePath } from 'next/cache';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const data = await request.json();
    console.log("Data received for update:", data);
    const property = await Property.findByIdAndUpdate(id, data, { new: true });
    console.log("Updated property from DB:", property);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Trigger revalidation for the home page and properties list
    revalidatePath('/');
    revalidatePath('/properties');
    revalidatePath(`/properties/${id}`);
    
    return NextResponse.json(property);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Trigger revalidation
    revalidatePath('/');
    revalidatePath('/properties');
    
    return NextResponse.json({ message: 'Property deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

