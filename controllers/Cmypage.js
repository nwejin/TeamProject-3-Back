const UserSchema = require('../models/UserSchema');
const { tokenCheck } = require('../utils/tokenCheck');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtSecret = process.env.JWTSECRET;

exports.getMyInfo = async (req, res) => {
    try {
        // console.log(req.body.id);
        const id = await tokenCheck(req);
        console.log('토큰 체크 후 아이디');
        const user = await UserSchema.findOne({
            user_id: id,
        });
        console.log('유저 정보', user);
        res.send({ info: user });
    } catch (error) {
        console.log(error);
    }
};

exports.checkUserNickname = async (req, res) => {
    try {
        // console.log(req.body);
        const { user_nickname } = req.body.userData;
        const user = await UserSchema.findOne({
            user_nickname: user_nickname,
        });
        if (!user) {
            res.send({
                success: true,
                message: '사용 가능한 닉네임입니다.',
            });
        } else {
            if (req.body.currentUserId == user.user_id) {
                res.send({
                    success: 'null',
                    message: '현재 사용 중인 아이디입니다.',
                });
            } else {
                res.send({
                    success: false,
                    message: '중복되는 닉네임이 있습니다.',
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: '닉네임 변경 실패' });
    }
};
exports.checkUserPassword = async (req, res) => {
    try {
        // console.log(req.body);
        const { user_password } = req.body.userData;
        const hashedPw = bcrypt.hashSync(user_password, 10);
        console.log(hashedPw);

        const currentUser = await UserSchema.findOne({
            user_id: req.body.currentUserId,
        });
        const user = await UserSchema.findOne({
            user_password: hashedPw,
        });
        if (!user) {
            res.send({
                success: false,
                message: '비밀번호 확인 실패',
            });
        } else {
            if (currentUser === user) {
                res.send({
                    success: true,
                    message: '비밀번호 확인 성공',
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: '비밀번호 확인 실패' });
    }
};
exports.modifyUserInfo = async (req, res) => {};
exports.deleteUserinfo = async (req, res) => {};
