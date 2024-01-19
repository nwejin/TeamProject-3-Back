const UserSchema = require("../models/UserSchema");
// const WordSchema = require("../models/WordSchema");
// const NewsSchema = require("../models/NewsSchema");

exports.userInsert = async (req, res) => {
    await UserSchema.create({
        user_id: "gqeew",
        user_password: "4903",
        user_email: "hi@gmail.com",
    })
        .then((result) => {
            console.log("data insert success");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.userLogin = async(req,res)=>{
    
}

exports.userRegister =async (req,res)=>{
    try {
        await UserSchema.create({
            user_id: req.body.user_id,
            user_password: req.body.user_password,
            user_email: req.body.user_email,
        });
        
        // 회원가입 성공 시 JSON 응답
        const responseData = '회원가입 성공';
        const responseData2 = '회원가입 실패';
        res.json(responseData);
    } catch (err) {
        console.log(err);
        // 회원가입 실패 시 JSON 응답
        res.status(500).json(responseData2);
    }
   
}