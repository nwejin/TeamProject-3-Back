const CommunitySchema = require('../models/CommunitySchema');
const CommentSchema = require('../models/CommentSchema');
const ReCommentSchema = require('../models/ReCommentSchema');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const { tokenCheck } = require('../utils/tokenCheck');
const UserSchema = require('../models/UserSchema');

exports.community = async (req, res) => {};

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
        const user_Profile = user.user_profile;
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
exports.communityLike = async (req, res) => {
    try {
        console.log('Received POST request to /community/like');
        const userId = await tokenCheck(req);
        console.log(userId);

        // 어떤 유저가 좋아요 했는지 확인
        const user = await UserSchema.findOne({
            user_id: userId,
        });
        if (!user) {
            return res.status(404).send('사용자 확인 불가');
        }
        console.log('req.body.postId>', req.body.postId); // 게시글 아이디
        console.log('req.body.like>', req.body.like); // 1 (좋아요)

        // 커뮤니티에서 id로 게시글 찾기
        const community = await CommunitySchema.findOne({
            _id: req.body.postId || req.body.data._id,
        });
        console.log(community);
        if (community) {
            if (community.likedUser.includes(user._id)) {
                return res.send('이미 좋아요를 눌렀음');
            }
        }

        community.like += req.body.like;
        community.likedUser.push(user._id);
        await community.save();

        res.send('좋아요 완료');
    } catch (err) {
        console.log(err);
        res.status(500).send('좋아요 오류 ');
    }
};

// 댓글 작성
exports.commentWrite = async (req, res) => {
    try {
        console.log('Received POST request to /community/commentWrite');

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

        await CommentSchema.create({
            communityId: req.body.postId,
            userId: user_id,
            userNickName: nickName,
            content: req.body.content,
            date: new Date().toISOString(),
        });
        res.send('댓글 작성 완료!');
    } catch (err) {
        console.log(err);
        res.status(500).send('댓글 작성 실패');
    }
};
// 댓글 호출
exports.commentRead = async (req, res) => {
    // // DB에서 데이터 가져오기
    const postId = req.query.postId;
    try {
        const comment = await CommentSchema.find({ communityId: postId }).sort({
            date: -1,
        });
        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).send('데이터 불러오기 실패');
    }
};

// 좋아요 순위로 가져오기
exports.communityRank = async (req, res) => {
    // DB에서 데이터 가져오기
    try {
        const rankPosts = await CommunitySchema.find()
            .sort({
                like: -1,
            })
            .limit(5);
        res.json(rankPosts);
    } catch (err) {
        console.log(err);
        res.status(500).send('데이터 불러오기 실패');
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
