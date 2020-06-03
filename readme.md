
# What is this?

This is a NodeJS project that uses Google Lighthouse to pull lighthouse reports in a json format. It then saves to S3 bucket.

## Command

### Pull values
node lighthouse.js --url https://www.reddit.com


### Comparison
node lighthouse.js --from reddit.com\2020-06-01T23_22_05.823Z --to reddit.com\2020-06-01T23_27_37.603Z



## more info
Lighthouse Integration - https://css-tricks.com/build-a-node-js-tool-to-record-and-compare-google-lighthouse-reports/
Uploading to s3 - https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
node env files - https://www.twilio.com/blog/working-with-environment-variables-in-node-js-html

## Next steps
Uploading to s3


## Sequence of Events
Create list of sites
script hits each site with lighthouse
lighthouse creates a ton of json files
script saves files directly to s3
aws glue reads and indexes the data
save results to redshift
then query redshift from frontend