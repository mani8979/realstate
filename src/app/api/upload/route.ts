import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const is3DModel = file.name.toLowerCase().endsWith('.glb') || file.name.toLowerCase().endsWith('.gltf');
    const resourceType = isVideo ? 'video' : (is3DModel ? 'raw' : 'auto');

    console.log(`Uploading file: ${file.name}, Type: ${file.type}, ResourceType: ${resourceType}`);

    // Upload to Cloudinary using stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'realstate_uploads',
          resource_type: resourceType,
          chunk_size: 6000000, // 6MB chunks for videos
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    }) as any;

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload API catch block:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error.message || 'Unknown error' 
    }, { status: 500 });
  }
}
