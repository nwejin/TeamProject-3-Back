const UserSchema = require("../models/UserSchema");
// const WordSchema = require("../models/WordSchema");
// const NewsSchema = require("../models/NewsSchema");

exports.userInsert = async (req, res) => {
    await UserSchema.create({
        user_id: "gqeew",
        user_password: "4903",
    })
        .then((result) => {
            console.log("data insert success");
        })
        .catch((err) => {
            console.log(err);
        });
};
