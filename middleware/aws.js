const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require("../config.json")
// Configure AWS SDK with your credentials
const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: config.aws_region,
});

// Configure multer storage for S3
const storage = multerS3({
  s3: s3,
  bucket: config.s3_bucket_name,
  acl: 'public-read', // Adjust the access control level as needed
  key: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
