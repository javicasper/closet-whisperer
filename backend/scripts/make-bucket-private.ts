/**
 * Migration script to make MinIO bucket private
 * Run this once to remove public access policy from existing bucket
 */

import { storageService } from '../src/services/storage.service.js';

async function main() {
  console.log('🔧 Making MinIO bucket private...');
  
  try {
    await storageService.init();
    await storageService.makePrivate();
    console.log('✅ Bucket is now private. All images now require presigned URLs.');
    console.log('💡 Direct URLs to MinIO will no longer work without authentication.');
  } catch (error) {
    console.error('❌ Failed to make bucket private:', error);
    process.exit(1);
  }
}

main();
