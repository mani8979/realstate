require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkCloudinary() {
  console.log('Checking Cloudinary configuration...');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connection Successful:', result);
    
    // Attempt to get account details
    try {
      const account = await cloudinary.api.usage();
      console.log('✅ Account is active. Plan:', account.plan);
    } catch (usageError) {
      console.log('ℹ️ Could not fetch usage details (this is common for some API keys), but connection is ACTIVE.');
    }
  } catch (error) {
    console.error('❌ Cloudinary Connection Failed:', error?.message || error);
  }
}

checkCloudinary();
