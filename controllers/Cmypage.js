const UserSchema = require('../models/UserSchema');
const { tokenCheck } = require('../utils/tokenCheck');

exports.UserModify = async (req, res) => {
    try {
        console.log(await tokenCheck(req));
    } catch (error) {}
};
