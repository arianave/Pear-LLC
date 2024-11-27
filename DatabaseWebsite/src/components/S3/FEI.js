const getPresignedUrl = async (bucketName, keyName) => {
    const params = {
      Bucket: bucketName,
      Key: keyName,
      Expires: 60, // URL valid for 60 seconds
      ContentType: 'image/jpeg',
    };
  
    return s3.getSignedUrlPromise('putObject', params);
  };
  const uploadImage = async (file, presignedUrl) => {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  
    if (response.ok) {
      console.log('Image uploaded successfully');
    } else {
      console.error('Error uploading image');
    }
  };
    