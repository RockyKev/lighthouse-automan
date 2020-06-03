require('dotenv').config(); //load environment file

const fs = require('fs');
const AWS = require('aws-sdk');

const ID = process.env.AMAZON_ACCESS_ID;
const SECRET = process.env.AMAZON_ACCESS_SECRET;
const BUCKET_NAME = process.env.AMAZON_S3_BUCKET;

//initialize S3
const s3 = new AWS.S3({
    accessKeyId: ID, 
    secretAccessKey: SECRET
})

const uploadFile = (fileName) => {
    
    //Read content from file
    const fileContent = fs.readFileSync(fileName);

    //Set up S3 upload params
    const params = {
        Bucket: BUCKET_NAME, 
        //Key: 'cat.jpg', //File name you want to save as in S3
        Key: fileName,
        Body: fileContent, 
        // StorageClass: '', //either S3 Standard or S3 Glacier
        // ContentType: '', //sets the image MIME type like image/jpeg
        // ContentLength: '', //set the body in bytes
        // ContentLanguage: '', //help if it needs translation
    }

    //uploading file to bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`)
    });
}

module.exports = {
    uploadFile
}

//uploadFile("cat.jpg", "catFolder/cat.jpg");
