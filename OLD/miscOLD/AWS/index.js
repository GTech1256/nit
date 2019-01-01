const AWS = require('aws-sdk');
const { AWS: awsConfig } = require('../../config/appconfig').default;


AWS.config.update({
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
    region: awsConfig.region
});

function uploadFileToS3(file, bucketName) {
  return new Promise((resolve, reject) => {
    try {
      const Bucket = bucketName;

      const s3bucket = new AWS.S3({
        accesKeyId: awsConfig.accessKeyId,
        secretAccesKey: awsConfig.secretAccessKey,
        Bucket
      });

      s3bucket.createBucket(() => {

        const params = {
          ACL: 'public-read',
          Bucket,
          Key: file.name,
          Body: file.data
        };

        s3bucket.upload(params, (err, data) => {
          if (err) {
            reject(err);
          };
          resolve(data);
        });
      });
    } catch (e) {
      console.error('can\'t upload file to S3 AWS Bucket', e);
      reject('can\'t upload file to S3 AWS Bucket');
    };
  });
};

module.exports = uploadFileToS3;
