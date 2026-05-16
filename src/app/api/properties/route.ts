import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Property from '@/lib/models/Property';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    
    const queryConditions: any[] = [];
    
    const location = searchParams.get('location');
    if (location) {
      queryConditions.push({
        $or: [
          { title: { $regex: location, $options: 'i' } },
          { location: { $regex: location, $options: 'i' } },
          { description: { $regex: location, $options: 'i' } },
          { type: { $regex: location, $options: 'i' } },
          { subType: { $regex: location, $options: 'i' } }
        ]
      });
    }
    
    const type = searchParams.get('type');
    if (type) {
      const typeLower = type.toLowerCase();
      // Clean up common pluralisms like "Lands" -> "Land"
      const normalizedType = type.replace(/\s*lands?$/i, '').trim();
      const simpleType = normalizedType.split(' ')[0]; // Get first word (e.g. "Farm" from "Farm Land")
      
      const typeConditions: any[] = [
        { type: { $regex: normalizedType, $options: 'i' } },
        { subType: { $regex: normalizedType, $options: 'i' } },
        { type: { $regex: type, $options: 'i' } },
        { subType: { $regex: type, $options: 'i' } },
        { type: { $regex: simpleType, $options: 'i' } },
        { subType: { $regex: simpleType, $options: 'i' } }
      ];
      
      if (typeLower.includes('land') || typeLower.includes('plot') || typeLower.includes('farm') || typeLower.includes('vmrda') || typeLower.includes('panchayat')) {
        typeConditions.push({ type: { $in: ['Land', 'Plot', 'Farm Land', 'Commercial'] } });
      }
      
      queryConditions.push({ $or: typeConditions });
    }

    const subType = searchParams.get('subType');
    if (subType) {
      queryConditions.push({ subType: { $regex: subType, $options: 'i' } });
    }

    const filters: any = queryConditions.length > 0 ? { $and: queryConditions } : {};
    
    let properties = await Property.find(filters).sort({ createdAt: -1 }).limit(200).lean();

    const budget = searchParams.get('budget');
    if (budget) {
      const parsePrice = (str: string): number => {
        if (!str) return 0;
        const s = str.toString().toLowerCase().replace(/,/g, '');
        const match = s.match(/[0-9]+(\.[0-9]+)?/);
        if (!match) return 0;
        let num = Number(match[0]);
        if (s.includes('cr')) num *= 10000000;
        else if (s.match(/lakh|lac|l\b/)) num *= 100000;
        else if (s.match(/k\b|thousand/)) num *= 1000;
        return num;
      };

      const budgetNum = parsePrice(budget);
      if (budgetNum > 0) {
        properties = properties.filter((p: any) => {
          if (!p.price) return false;
          const propertyPriceNum = parsePrice(p.price);
          if (propertyPriceNum === 0) return false;
          return propertyPriceNum === budgetNum;
        });
      }
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
    
    const payloadSize = JSON.stringify(cleanedData).length;
    if (payloadSize > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

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
    const status = error.name === 'ValidationError' ? 400 : 500;
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value
      })) : []
    }, { status });
  }
}

