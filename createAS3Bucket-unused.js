require('dotenv').config(); //load environment file

const AWS = require('aws-sdk');

//via .env file
const ID = process.env.AMAZON_ACCESS_ID;
const SECRET = process.env.AMAZON_ACCESS_SECRET;
const BUCKET_NAME = ''; //name of the bucket
const BUCKET_LOCATION = ''; //location == us-west-2, us-east-1

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

