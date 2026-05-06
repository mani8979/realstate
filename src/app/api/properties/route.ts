import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const filters: any = {};
    
    const location = searchParams.get('location');
    if (location) filters.location = { $regex: location, $options: 'i' };
    
    const type = searchParams.get('type');
    if (type) {
      if (type === 'Land' || type === 'Plot') {
        filters.type = { $in: ['Land', 'Plot', 'Farm Land'] };
      } else {
        filters.type = type;
      }
    }

    const subType = searchParams.get('subType');
    if (subType) filters.subType = subType;
    
    const budget = searchParams.get('budget');
    if (budget) filters.price = { $lte: Number(budget) };

    const properties = await Property.find(filters).sort({ createdAt: -1 });
    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Simple admin check (this should be replaced by proper auth in production)
    // For now, we'll assume the admin is logged in if they can reach this
    // but in reality we'd check a session or header
    
    const property = await Property.create(data);
    
    // Trigger revalidation
    revalidatePath('/');
    revalidatePath('/properties');
    
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

