const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.community = (req, res) => {};

// 1. DB 저장

// (exports.communityWrite = upload.single('file')),
exports.communityWrite = async (req, res) => {
    try {
        console.log('Received POST request to /community/write');

        const tokenCheck = async (req) => {
            const token = req.cookies.jwtCookie;
            if (!token) {
                return false;
            } else {
                const result = jwt.verify(token, process.env.JWTSECRET);
                const checkID = await UserSchema.findOne({
                    user_id: result.id,
                    user_nickname: result.nickname,
                });
                if (checkID) {
                    return;
                    {
                        result.id, result.nickname;
                    }
                } else {
                    return false;
                }
            }
        };
        // console.log(console.log('tokenCheck', tokenCheck));
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

        // console.log(req.cookies.jwtCookie);
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
