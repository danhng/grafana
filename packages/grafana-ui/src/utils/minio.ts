import { Client } from 'minio';

export const StorageConfig = {
  endPoint: 'store.htaviet.com',
  port: 443,
  useSSL: true,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
  bucketName: 'htaviet-test',
};

export const minioClient = new Client(StorageConfig);
