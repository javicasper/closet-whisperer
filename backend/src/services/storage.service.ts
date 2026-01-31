import * as Minio from 'minio';
import { config } from '../config.js';
import crypto from 'crypto';

export class StorageService {
  private client: Minio.Client;
  private bucket: string;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.client = new Minio.Client({
      endPoint: config.MINIO_ENDPOINT,
      port: config.MINIO_PORT,
      useSSL: config.MINIO_USE_SSL,
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
    });
    this.bucket = config.MINIO_BUCKET;
  }

  async init(): Promise<void> {
    // Prevent race conditions with multiple init calls
    if (this.initialized) {
      return;
    }
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._init();
    await this.initPromise;
    this.initialized = true;
    this.initPromise = null;
  }

  private async _init(): Promise<void> {
    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, 'us-east-1');
        console.log(`✅ Created MinIO bucket: ${this.bucket} (private)`);
      } else {
        console.log(`✅ MinIO bucket already exists: ${this.bucket}`);
        // Make sure bucket is private (set empty policy)
        try {
          const emptyPolicy = {
            Version: '2012-10-17',
            Statement: [],
          };
          await this.client.setBucketPolicy(this.bucket, JSON.stringify(emptyPolicy));
          console.log(`🔒 Ensured bucket ${this.bucket} is private`);
        } catch (error: any) {
          // Ignore error if policy doesn't exist
          if (error.code !== 'NoSuchBucketPolicy') {
            console.warn('Warning: could not verify bucket privacy:', error.message);
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize MinIO storage:', error);
      throw error;
    }
  }

  async uploadImage(
    fileBuffer: Buffer,
    mimetype: string
  ): Promise<{ url: string; key: string }> {
    const extension = mimetype.split('/')[1] || 'jpg';
    const key = `${crypto.randomUUID()}.${extension}`;

    await this.client.putObject(this.bucket, key, fileBuffer, fileBuffer.length, {
      'Content-Type': mimetype,
    });

    const url = `http://${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${this.bucket}/${key}`;
    return { url, key };
  }

  async deleteImage(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }

  getPublicUrl(key: string): string {
    return `http://${config.MINIO_ENDPOINT}:${config.MINIO_PORT}/${this.bucket}/${key}`;
  }

  /**
   * Generate a presigned URL for private access to an object
   * @param storageKey - The object key in the bucket
   * @param expirySeconds - Expiry time in seconds (default: 3600 = 1 hour)
   * @returns Presigned URL that expires after the specified time
   */
  async getPresignedUrl(storageKey: string, expirySeconds: number = 3600): Promise<string> {
    try {
      const url = await this.client.presignedGetObject(
        this.bucket,
        storageKey,
        expirySeconds
      );
      return url;
    } catch (error) {
      console.error('Failed to generate presigned URL:', error);
      throw new Error('Failed to generate presigned URL');
    }
  }

  /**
   * Remove public access policy from bucket (make it private)
   */
  async makePrivate(): Promise<void> {
    try {
      // Set an empty/restrictive bucket policy to make it private
      // MinIO doesn't have a direct "remove policy" method in the JS client
      // Setting an empty policy effectively makes the bucket private
      const emptyPolicy = {
        Version: '2012-10-17',
        Statement: [],
      };
      await this.client.setBucketPolicy(this.bucket, JSON.stringify(emptyPolicy));
      console.log(`✅ Bucket ${this.bucket} is now private`);
    } catch (error) {
      console.error('Failed to make bucket private:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
