import { Client } from 'minio';

export const StorageConfig = {
  endPoint: 'erp.htaviet.com',
  port: 7374,
  useSSL: true,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
  bucketName: 'htaviet-test',
};

export const minioClient = new Client(StorageConfig);
