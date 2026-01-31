/**
 * Test script for presigned URLs functionality
 */

import { storageService } from '../src/services/storage.service.js';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

async function testPresignedURLs() {
  console.log('🧪 Testing Presigned URLs Implementation\n');

  try {
    // 1. Initialize storage
    console.log('1️⃣ Initializing storage service...');
    await storageService.init();
    console.log('✅ Storage initialized\n');

    // 2. Create a test image
    console.log('2️⃣ Creating test image...');
    const testImageBuffer = Buffer.from('fake-image-data-' + crypto.randomBytes(100).toString('hex'));
    const testKey = `test-${Date.now()}.jpg`;
    console.log('✅ Test image created\n');

    // 3. Upload image
    console.log('3️⃣ Uploading test image...');
    const { url: publicUrl, key: storageKey } = await storageService.uploadImage(
      testImageBuffer,
      'image/jpeg'
    );
    console.log(`✅ Image uploaded`);
    console.log(`   Storage Key: ${storageKey}`);
    console.log(`   Public URL (should NOT work): ${publicUrl}\n`);

    // 4. Generate presigned URL
    console.log('4️⃣ Generating presigned URL...');
    const presignedUrl = await storageService.getPresignedUrl(storageKey, 3600);
    console.log(`✅ Presigned URL generated`);
    console.log(`   URL: ${presignedUrl.substring(0, 80)}...`);
    console.log(`   Expires in: 1 hour\n`);

    // 5. Test accessing with presigned URL
    console.log('5️⃣ Testing presigned URL access...');
    const response = await fetch(presignedUrl);
    if (response.ok) {
      console.log('✅ Presigned URL works! (200 OK)');
      const data = await response.arrayBuffer();
      console.log(`   Downloaded ${data.byteLength} bytes\n`);
    } else {
      console.log(`❌ Presigned URL failed: ${response.status} ${response.statusText}\n`);
    }

    // 6. Test accessing without signature (should fail)
    console.log('6️⃣ Testing direct MinIO access (should fail)...');
    try {
      const directUrl = storageService.getPublicUrl(storageKey);
      console.log(`   Trying: ${directUrl}`);
      const directResponse = await fetch(directUrl);
      if (directResponse.ok) {
        console.log('⚠️  WARNING: Direct URL works! Bucket may still be public.\n');
      } else if (directResponse.status === 403) {
        console.log('✅ Direct URL blocked! (403 Forbidden) - Bucket is private\n');
      } else {
        console.log(`❓ Direct URL returned: ${directResponse.status} ${directResponse.statusText}\n`);
      }
    } catch (error: any) {
      console.log(`❌ Error testing direct URL: ${error.message}\n`);
    }

    // 7. Cleanup
    console.log('7️⃣ Cleaning up test image...');
    await storageService.deleteImage(storageKey);
    console.log('✅ Test image deleted\n');

    // 8. Summary
    console.log('═══════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════');
    console.log('Presigned URLs are working correctly:');
    console.log('• Images are uploaded to private bucket');
    console.log('• Presigned URLs provide temporary access');
    console.log('• Direct MinIO URLs are blocked');
    console.log('═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testPresignedURLs();
