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
          folder: 'starlands_uploads',
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
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
export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || !url.includes('cloudinary.com')) {
      return NextResponse.json({ error: 'Invalid Cloudinary URL' }, { status: 400 });
    }

    // Extract public_id from URL
    // Format: .../v[version]/[folder]/[id].[ext]
    const parts = url.split('/');
    const folderIndex = parts.findIndex((p: string) => p === 'starlands_uploads');
    if (folderIndex === -1) {
      return NextResponse.json({ error: 'Could not find folder in URL' }, { status: 400 });
    }

    const publicIdWithExt = parts.slice(folderIndex).join('/');
    const publicId = publicIdWithExt.split('.')[0];

    // Determine resource type from URL or extension
    let resourceType: 'image' | 'video' | 'raw' = 'image';
    if (url.includes('/video/upload/')) resourceType = 'video';
    if (url.endsWith('.glb') || url.endsWith('.gltf')) resourceType = 'raw';

    console.log(`Deleting Cloudinary asset: ${publicId}, Type: ${resourceType}`);

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: 'Delete failed', details: error.message }, { status: 500 });
  }
}
