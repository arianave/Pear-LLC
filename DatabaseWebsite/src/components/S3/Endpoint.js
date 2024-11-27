   const AWS = require('aws-sdk');
   const s3 = new AWS.S3({
       region: 'US East (N. Virginia) us-east-1',
       
   });

   app.post('/get-signed-url', (req, res) => {
       const fileName = req.body.fileName;
       const fileType = req.body.fileType;

       const params = {
           Bucket: 'my-aws-project-bucket-0987',
           Key: fileName,
           Expires: 600, 
           ContentType: fileType,
       };

       s3.getSignedUrl('putObject', params, (err, url) => {
           if (err) {
               console.log(err);
               res.status(500).send(err);
           } else {
               res.json({ url });
           }
       });
   });