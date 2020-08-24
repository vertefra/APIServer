const aws = require('aws-sdk')
const express = require('express')
const multer = require('multer')
const multerS3 = require('multer-s3')

const ACCESS_KEY = process.env.ACCESS_KEY
const ACCESS_ID = process.env.ACCESS_ID
 
aws.config.update({
    secretAccessKey: ACCESS_KEY,
    accessKeyId: ACCESS_ID,
    region: 'us-east-1'
})

const s3 = new aws.S3()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type, only JPEG and PNG'), false)
    }
} 
 
const upload = multer({
    fileFilter: fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: 'feisbuc-profile-images',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: 'TESTING_META_DATA'});
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    }),
    // limits: {fileSize: 1500}
})

module.exports = upload