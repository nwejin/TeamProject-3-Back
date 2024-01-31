const UserSchema = require('../models/UserSchema');
const { tokenCheck } = require('../utils/tokenCheck');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwtSecret = process.env.JWTSECRET;

exports.getMyInfo = async (req, res) => {
    try {
        // console.log(req.body.id);
        const id = await tokenCheck(req);
        // console.log('토큰 체크 후 아이디');
        const user = await UserSchema.findOne({
            user_id: id,
        });
        // console.log('유저 정보', user);
        res.send({ info: user });
    } catch (error) {
        console.log(error);
        res.send('false');
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
        const currentUser = await UserSchema.findOne({
            user_id: req.body.currentUserId,
        });
        const result = bcrypt.compareSync(
            user_password,
            currentUser.user_password
        );
        if (!result) {
            res.send({
                success: false,
                message: '비밀번호 확인 실패',
            });
        } else {
            res.send({
                success: true,
                message: '비밀번호 확인 성공',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: '비밀번호 확인 실패' });
    }
};
exports.modifyUserInfo = async (req, res) => {
    const { user_nickname, user_changepw, user_email } = req.body;
    // req.body.userData;
    // console.log('req body>', req.body);
    // console.log('nickname>', req.body.user_nickname);
    console.log(req.body.user_profile);
    console.log(req.file);
    const user_profile = req.file ? req.file.location : null;

    console.log('user_profile', user_profile);
    const currentUserId = req.body.user_id;
    try {
        console.log('현재 사용자 아이디', currentUserId);

        const hashedPw = bcrypt.hashSync(user_changepw, 10);
        const modifyUser = await UserSchema.updateOne(
            {
                user_id: currentUserId,
            },
            {
                user_email: user_email,
                user_password: hashedPw,
                user_nickname: user_nickname,
                user_profile: user_profile,
            }
        );
        console.log(modifyUser);
        res.send({
            success: true,
            message: '회원정보 DB 수정 완료',
        });
    } catch (error) {
        console.log('회원정보 DB 수정 에러');
        res.send({
            success: false,
            message: '회원정보 DB 수정 에러',
        });
    }
};
exports.deleteUserinfo = async (req, res) => {
    const currentUserId = req.body.currentUserId;
    try {
        console.log('현재 사용자 아이디', currentUserId);
        const deleteUser = await UserSchema.deleteOne({
            user_id: currentUserId,
        });
        console.log(deleteUser);
        res.send({
            success: true,
            message: '회원정보 DB 삭제 완료',
        });
    } catch (error) {
        console.log('회원정보 DB 삭제 에러');
        res.send({
            success: false,
            message: '회원정보 DB 삭제 에러',
        });
    }
};
