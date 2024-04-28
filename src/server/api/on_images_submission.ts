import { S3 } from 'aws-sdk';

// Configure AWS S3 with your credentials and bucket details
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// This function handles the file upload to S3
const uploadToS3 = async (file: File) => {
  const params: S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!, // Add '!' to assert that the value is not undefined
    Key: `${Date.now()}_${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    const s3Response = await s3.upload(params).promise();
    console.log('File uploaded successfully', s3Response);
    return s3Response;
  } catch (err) {
    console.error('Error uploading file', err);
    throw err;
  }
};

// The function to call on button click
//export const onFileSubmission = async () => {
export const onFileSubmission = async (files: string) => {
  console.log('Uploading files...');
  // const uploadPromises = Array.from(files).map(uploadToS3);

  // try {
  //   const results = await Promise.all(uploadPromises);
  //   // Perform additional logic with results if needed
  //   console.log('All files uploaded', results);
  // } catch (err) {
  //   console.error('Error uploading one or more files', err);
  // }
};
