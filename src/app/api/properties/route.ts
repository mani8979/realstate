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
    if (location) {
      filters.$or = [
        { title: { $regex: location, $options: 'i' } },
        { location: { $regex: location, $options: 'i' } },
        { description: { $regex: location, $options: 'i' } }
      ];
    }
    
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
    
    let properties = await Property.find(filters).sort({ createdAt: -1 });

    const budget = searchParams.get('budget');
    if (budget) {
      const budgetNum = Number(budget);
      properties = properties.filter((p: any) => {
        if (!p.price) return false;
        // Extract only the numeric part (e.g. "1000(per sq yard)" -> 1000)
        const numericPriceStr = p.price.toString().replace(/[^0-9]/g, '');
        if (!numericPriceStr) return false;
        return Number(numericPriceStr) <= budgetNum;
      });
    }

    return NextResponse.json(properties);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const conn = await dbConnect();
    console.log('Database connection state:', conn.connection.readyState);
    
    const data = await request.json();
    
    // Clean data: convert empty strings to undefined for numeric fields
    const cleanedData = { ...data };
    if (cleanedData.bedrooms === "") cleanedData.bedrooms = undefined;
    if (cleanedData.bathrooms === "") cleanedData.bathrooms = undefined;
    
    console.log('Attempting to create property with data:', JSON.stringify(cleanedData, null, 2));
    
    const property = await Property.create(cleanedData);
    console.log('Property created successfully:', property._id);
    
    // Trigger revalidation (optional, wrap in try/catch to avoid failing the whole request)
    try {
      revalidatePath('/');
      revalidatePath('/properties');
    } catch (revalError) {
      console.error('Revalidation failed:', revalError);
    }
    
    return NextResponse.json(property, { status: 201 });
  } catch (error: any) {
    console.error('FULL Property creation error:', error);
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

