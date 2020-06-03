//load environment file
require('dotenv').config();

const AWS = require('aws-sdk');

//via .env file
const ID = process.env.AMAZON_ACCESS_ID;
const SECRET = process.env.AMAZON_ACCESS_SECRET;
const BUCKET_NAME = process.env.AMAZON_S3_BUCKET;
const BUCKET_LOCATION = process.env.AMAZON_S3_LOCATION;

//initialize S3
const s3 = new AWS.S3({
    accessKeyId: ID, 
    secretAccessKey: SECRET
})

const params = {
    Bucket: BUCKET_NAME, 
    CreateBucketConfiguration: {
        LocationConstraint: BUCKET_LOCATION
    }
}

s3.createBucket(params, function(err, data) {
    (err) ? console.log(err, err.stack) : console.log("Bucket Created Successfully", data.location);
})

