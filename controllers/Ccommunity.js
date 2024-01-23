const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

// aws-s3관련 (이미지)
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid4');

require('dotenv').config();

// s3 정보 저장
const s3 = new AWS.S3({
    region: process.env.AWS_REGION,
    accessKeyID: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRECTACCESSKEY,
});

// multer 설정
const storage = multerS3({
    s3: s3,
    acl: 'public-read-write',
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        const filename = `${uuid()}-${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({ storage: storage });

exports.community = (req, res) => {};

// 1. DB 저장
exports.communityWrite = async (req, res) => {
    try {
        console.log('Received POST request to /community/write?');
        console.log(req.body);
        // const fileUrl = req.file.location;
        await CommunitySchema.create({
            title: req.body.title,
            content: req.body.content,
            subject: req.body.subject,
            // 현재 파일은 빈 객체
            // image: fileUrl,
            // 한국 시간 (등록 시간)
            date: new Date().toLocaleDateString('ko-KR', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
            }),
        });
        res.send('게시글 작성 완료');
    } catch (err) {
        console.log(err);
    }
};

// 2. 저장된 값 불러와서 프론트에 보내주기 (최신순으로)
exports.communityRead = async (req, res) => {
    // DB에서 데이터 가져오기
    try {
        const communityPosts = await CommunitySchema.find().sort({
            // 내림차순
            date: -1,
        });
        res.json(communityPosts);
    } catch (err) {
        console.log(err);
        res.status(500).send('데이터 불러오기 실패');
    }
};

// 댓글 작성
exports.commentWrite = async (req, res) => {};
