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
    console.log('API GET request for ID:', id);
    await dbConnect();
    const property = await Property.findById(id);
    console.log('API GET Property search result:', property ? property.title : 'NULL');
    if (!property) {
      console.log('API GET Property not found in DB! Returning 404.');
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error: any) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conn = await dbConnect();
    console.log('Database connection state:', conn.connection.readyState);
    
    const data = await request.json();
    
    // Clean data: convert empty strings to undefined for numeric fields
    const cleanedData = { ...data };
    if (cleanedData.bedrooms === "") cleanedData.bedrooms = undefined;
    if (cleanedData.bathrooms === "") cleanedData.bathrooms = undefined;
    
    console.log('Updating property with ID:', id, 'Data:', JSON.stringify(cleanedData, null, 2));
    
    const property = await Property.findByIdAndUpdate(id, cleanedData, { new: true });
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Trigger revalidation (optional, wrap in try/catch)
    try {
      revalidatePath('/');
      revalidatePath('/properties');
      revalidatePath(`/properties/${id}`);
      revalidatePath(`/properties/${id}/media`);
    } catch (revalError) {
      console.error('Revalidation failed:', revalError);
    }
    
    return NextResponse.json(property);
  } catch (error: any) {
    console.error('FULL Property update error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })) : []
    }, { status: 500 });
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

