const UserSchema = require('../models/UserSchema');
const { tokenCheck } = require('../utils/tokenCheck');

exports.UserModify = async (req, res) => {
    try {
        // console.log(req.body.id);
        const id = await tokenCheck(req);
        const user = await UserSchema.find({
            user_id: id,
        });
        console.log(id);
        res.send({ info: user });
    } catch (error) {
        console.log(error);
    }
};

exports.hi = async (req, res) => {
    try {
        const id = await tokenCheck(req);
        console.log(id);
        res.send({ hi: id });
    } catch (error) {
        console.log(error);
    }
};
