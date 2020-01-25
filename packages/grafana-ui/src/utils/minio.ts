import { Client } from 'minio';

export const StorageConfig = {
  endPoint: '27.72.88.195',
  port: 7374,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
  bucketName: 'htaviet-test',
};

export const minioClient = new Client(StorageConfig);
