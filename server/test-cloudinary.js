import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load environment variables
dotenv.config();

console.log('Environment variables check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('\nCloudinary config:', cloudinary.config());

// Test upload with a simple string
const testUpload = async () => {
  try {
    const testData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const result = await cloudinary.uploader.upload(testData, {
      folder: 'skillsphere',
      resource_type: 'auto'
    });
    console.log('\n✓ Upload test successful!');
    console.log('URL:', result.secure_url);
  } catch (error) {
    console.error('\n✗ Upload test failed:');
    console.error('Error:', error.message);
    console.error('Details:', error.error);
  }
};

testUpload();
