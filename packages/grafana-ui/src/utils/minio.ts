import { Client } from 'minio';

// Instantiate the minio client with the endpoint
// and access keys as shown below.
const minioClient = new Client({
  endPoint: 's3.amazonaws.com',
  useSSL: true,
  accessKey: 'AKIAJM6K37EJWCIRL3HA',
  secretKey: '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',
});

export const listObjects = (): void => {
  const objectsStream = minioClient.listObjects('htaviet-test', 'bmt/passion-fruit/2020-01-05', true);
  // tslint:disable-next-line:only-arrow-functions
  objectsStream.on('data', function(obj) {
    console.log(obj);
  });
  // tslint:disable-next-line:only-arrow-functions
  objectsStream.on('error', function(e) {
    console.log(e);
  });
};
