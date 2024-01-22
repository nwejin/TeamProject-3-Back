const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

// aws-s3관련
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid4');

require('dotenv').config();

// const s3 = new AWS.S3({
//     region: process.env.AWS_REGION,
//     accessKeyID: process.env.AWS_ACCESSKEY,
//     secretAccessKey: process.env.AWS_SECRECTACCESSKEY,
// });

// const storage = multerS3({
//     s3: s3,
//     acl: 'public-read-write',
//     bucket: process.env.AWS_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//         const filename = `${uuid()}-${file.originalname}`;
//         cb(null, filename);
//     },
// });

// const upload = multer({ storage: storage });

exports.community = (req, res) => {};

// 1. DB 저장
exports.communityWrite = async (req, res) => {
    try {
        console.log(req.body);
        // const fileUrl = req.file.location;
        await CommunitySchema.create({
            title: req.body.title,
            content: req.body.content,
            subject: req.body.subject,
            // file: req.body.file,
        });
        res.send('게시글 작성 완료');
    } catch (err) {
        console.log(err);
    }
};

// 2. 저장된 값 불러와서 프론트에 보내주기 (최신순으로)
exports.communityRead = async (req, res) => {};

// 댓글 작성
exports.commentWrite = async (req, res) => {};
