import { Client } from 'minio';

// Instantiate the minio client with the endpoint
// and access keys as shown below.
export const minioClient = new Client({
  endPoint: '27.72.88.195',
  port: 7374,
  useSSL: false,
  // accessKey: 'AKIAJM6K37EJWCIRL3HA',
  // secretKey: '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',
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
});
