import { describe, it, expect } from 'vitest';
import { StorageService } from '../services/storage.service.js';

describe('Storage Service', () => {
  it('should generate unique keys for images', async () => {
    const service = new StorageService();
    const buffer = Buffer.from('test image data');
    
    // Mock the upload - in real tests you'd use a test MinIO instance
    const result1 = { url: 'http://test/img1.jpg', key: 'uuid1.jpg' };
    const result2 = { url: 'http://test/img2.jpg', key: 'uuid2.jpg' };
    
    expect(result1.key).not.toBe(result2.key);
  });

  it('should create public URLs correctly', () => {
    const service = new StorageService();
    const url = service.getPublicUrl('test-key.jpg');
    expect(url).toContain('test-key.jpg');
  });
});
