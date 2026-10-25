import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { envs } from '../config/envs';

@Injectable()
export class StorageService {
  private readonly s3 = new S3Client({
    region: envs.AWS_REGION,
    credentials: {
      accessKeyId: envs.AWS_ACCESS_KEY_ID,
      secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
    },
  });

  // Sube el archivo al bucket dentro de <folder>/ y regresa su URL pública.
  // El nombre es un UUID para que dos fotos con el mismo nombre no se pisen.
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${randomUUID()}${extname(file.originalname)}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: envs.AWS_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${envs.AWS_BUCKET}.s3.${envs.AWS_REGION}.amazonaws.com/${key}`;
  }
}
