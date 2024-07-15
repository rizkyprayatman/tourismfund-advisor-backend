require("dotenv").config();
const { S3 } = require("@aws-sdk/client-s3");

const awsBucket = new S3({
    endpoint: `${process.env.R2_END_POINT}`, 
    region: `${process.env.R2_REGION}`,
    credentials: {
        accessKeyId: `${process.env.R2_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.R2_SECRET_ACCESS_KEY}`,
    },
});

module.exports = awsBucket;
