
# What is this?

This is a NodeJS project that uses Google Lighthouse to pull lighthouse reports in a json format. It then saves to S3 bucket.

## How to use

### Pull values
node lighthouse.js --url https://www.reddit.com

### Comparison
node lighthouse.js --from reddit.com\2020-06-01T23_22_05.823Z --to reddit.com\2020-06-01T23_27_37.603Z


## How to set up
1. copy `env.example`
2. add your personal info in there
3. rename to `.env`

## Reference Links
Lighthouse Integration - https://css-tricks.com/build-a-node-js-tool-to-record-and-compare-google-lighthouse-reports/
Uploading to s3 - https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
node env files - https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html
Ideal Nodejs Project Structure: https://softwareontheroad.com/ideal-nodejs-project-structure/

## Next steps
aws glue reads and indexes the data


## Sequence of Events
~Create list of sites~
~script hits each site with lighthouse~
~lighthouse creates a ton of json files~
~script saves files directly to s3~
~pull data to a test report~
finally clean up node projects