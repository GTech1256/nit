import AWS from 'aws-sdk';
import fs from 'fs';

const Bucket = process.env.AWS_BUCKET_NAME;

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.update({
  accessKeyId,
  secretAccessKey,
  region: process.env.AWS_REGION,
});

const s3bucket = new AWS.S3({
  accessKeyId,
  secretAccessKey,
  Bucket,
});

export function uploadFileToS3({ name, path, type }) {
  return new Promise((resolve, reject) => {
    try {
      const stream = fs.createReadStream(path);
      stream.on('error', (err) => {
        reject(err);
      });

      s3bucket.createBucket(() => {
        const params = {
          ACL: 'public-read',
          Bucket,
          Key: name,
          Body: stream,
          ContentType: type,
        };

        s3bucket.upload(params, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
    } catch (e) {
      console.error("can't upload file to S3 AWS Bucket", e);
      reject(new Error("can't upload file to S3 AWS Bucket"));
    }
  });
}

export function removeFileToS3(name) {
  return new Promise((resolve, reject) => {
    try {
      const params = {
        Bucket,
        Delete: {
          // required
          Objects: [
            // required
            {
              Key: name, // required
            },
          ],
        },
      };

      s3bucket.deleteObjects(params, (err, data) => {
        if (err) reject(err);
        // console.log(err, err.stack);
        // an error occurred
        else resolve(data); // successful response
      });
    } catch (e) {
      console.error("can't upload file to S3 AWS Bucket", e);
      reject(new Error("can't upload file to S3 AWS Bucket"));
    }
  });
}
