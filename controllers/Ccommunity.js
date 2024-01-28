const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const { tokenCheck } = require('../utils/tokenCheck');
const UserSchema = require('../models/UserSchema');

exports.community = (req, res) => {};

// 1. DB 저장

// (exports.communityWrite = upload.single('file')),
exports.communityWrite = async (req, res) => {
    try {
        console.log('Received POST request to /community/write');

        const userId = await tokenCheck(req);
        console.log(userId);

        const user = await UserSchema.findOne({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).send('사용자 확인 불가');
        }

        const nickName = user.user_nickname;
        const user_id = user._id;
        console.log(nickName);

        // console.log('req.body>', req.body);

        // console.log('req.body.file >', req.body.file);
        // console.log('req.file >', req.file);

        const imageUrl = req.file ? req.file.location : null;
        // console.log('Uploaded Image URL:', imageUrl);
        await CommunitySchema.create({
            userId: user_id,
            userNickName: nickName,
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

// 좋아요 데이터
// exports.communityLike = asy;

// 댓글 작성
exports.commentWrite = async (req, res) => {};

exports.communityCommentWrite = async (req, res) => {
    try {
        console.log('Received POST request to /community/commentWrite');
        await CommentSchema.create({
            communityId: req.body.postId,
            userId: req.body.userId,
            content: req.body.content,
            date: new Date().toISOString(),
        });
        res.send('댓글 작성 완료!');
    } catch (err) {
        console.log(err);
        res.status(500).send('댓글 작성 실패');
    }
};

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
