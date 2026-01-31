import * as Minio from 'minio';
import { config } from '../config.js';
import crypto from 'crypto';

export class StorageService {
  private client: Minio.Client;
  private bucket: string;

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
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket, 'us-east-1');
      // Set bucket policy to allow public read
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      };
      await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
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
}

export const storageService = new StorageService();
