import { Env } from '../types/env';

export class StorageService {
  private bucket: R2Bucket;

  constructor(bucket: R2Bucket) {
    this.bucket = bucket;
  }

  async uploadFile(key: string, file: File | Blob): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    await this.bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });
  }

  async getFile(key: string): Promise<R2ObjectBody | null> {
    return await this.bucket.get(key);
  }

  async deleteFile(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  generateKey(userId: string, filename: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 10);
    // Remove special characters and spaces from filename, keep extension
    const cleanName = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${userId}/${timestamp}-${random}-${cleanName}`;
  }
}
