const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

const jwt = require('jsonwebtoken');

// const { S3Client } = require('@aws-sdk/client-s3');
// // aws-s3관련 (이미지)
// const AWS = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const uuid = require('uuid4');

// require('dotenv').config();

// // s3 정보 저장
// const s3 = new S3Client({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.AWS_ACCESSKEY,
//         secretAccessKey: process.env.AWS_SECRECTACCESSKEY,
//     },
// });

// // multer 설정
// const storage = multerS3({
//     s3: s3,
//     acl: 'public-read-write',
//     bucket: process.env.AWS_BUCKET,
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     key: (req, file, cb) => {
//         const filename = `${uuid()}-${file.originalname}`;
//         cb(null, filename);
//     },
//     // limits: { fileSize: 5 * 1024 * 1024 },
// });

// // exports.upload.single('file');

// const upload = multer({ storage: storage });

exports.community = (req, res) => {};

// 1. DB 저장

// (exports.communityWrite = upload.single('file')),
exports.communityWrite = async (req, res) => {
    try {
        console.log('Received POST request to /community/write');
        // console.log('req.body>', req.body);

        // console.log('req.body.file >', req.body.file);
        // console.log('req.file >', req.file);

        const imageUrl = req.file ? req.file.location : null;
        // console.log('Uploaded Image URL:', imageUrl);
        await CommunitySchema.create({
            title: req.body.title,
            content: req.body.content,
            subject: req.body.subject,
            // 파일
            image: imageUrl,
            // req.file ? req.file.location : null,
            // 한국 시간 (등록 시간)
            date: new Date().toISOString(),
        });

        res.send('게시글 작성 완료');

        const userDetail = jwt.verify(req.cookies.jwtCookie);
        console.log(userDetail);
        console.log(req.cookies.jwtCookie);
    } catch (err) {
        console.log(err);
        res.status(500).send('게시글 작성 실패');
    }
};

// 좋아요 데이터

// 2. 저장된 값 불러와서 메인 커뮤니티 화면에  보내주기 (최신순으로)
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

exports.getMainBoards = async (req, res) => {
    try {
        const board = await CommunitySchema.find().limit(5);
        if (board.length === 0) {
            res.send({ success: false, msg: '등록한 글이 없습니다.' });
        } else {
            res.send({ success: true, board: board });
        }
    } catch (error) {
        console.log(error);
    }
};
