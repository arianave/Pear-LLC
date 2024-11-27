const AWS = require('aws-sdk');
const fs = require('fs'); // For handling files

// Configure AWS
AWS.config.update({
  
  region: 'US East (N. Virginia) us-east-1', // e.g., 'us-east-1'
});

// Initialize S3
const s3 = new AWS.S3();

const uploadFile = (filePath, bucketName, keyName) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: keyName, // The name of the file in the bucket
    Body: fileContent,
    ContentType: 'image/jpeg', // Update based on your file type
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
    } else {
      console.log('File uploaded successfully:', data.Location);
    }
  });
};

// Usage
uploadFile('path/to/image.jpg', 'your-bucket-name', 'uploaded-image.jpg');
