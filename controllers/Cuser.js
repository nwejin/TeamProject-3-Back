const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserSchema = require("../models/UserSchema");
// const WordSchema = require("../models/WordSchema");

const jwtSecret = 'aldiuasjdbcmbxmziuuedj' 

const cookieConfig = {
	httpOnly: true,
	maxAge: 30 * 60 * 1000, 
}

const cookieConfig2 = {
	httpOnly: true,
	maxAge: 7*24*60 * 60 * 1000,
}

const tokenCheck = async (req) => {
	const token = req.cookies.jwtCookie;
	if (!token) {
		return false;
	} else {
		const result = jwt.verify(token, jwtSecret);
		const checkID = await UserSchema.findOne({
			 user_id: result.id 
		}) 
		if (checkID) {
			return (result.id);
		} else {
			return false;
		}
	}
}


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

exports.userLogin = async (req, res) => {
    try {
        const { user_id, user_password, isChecked } = req.body;
        console.log(user_id, user_password, isChecked);
       

        // 아이디 저장
        if(isChecked===true){
            res.cookie('saveId', user_id, cookieConfig2);
        }

        console.log(req.cookies.saveId);

        const user = await UserSchema.findOne({
                user_id: user_id,
        });

        if (!user) {
            res.json({ success: false, message: '존재하지 않는 아이디입니다.', cookieId:req.cookies.saveId });
        } else {
            const storedPassword = user.user_password;
            const isPasswordMatch = bcrypt.compareSync(user_password, storedPassword);

            if (!isPasswordMatch) {
                res.json({ success: false, message: '비밀번호가 일치하지 않습니다.', cookieId: req.cookies.saveId });
            } else {
                const token = jwt.sign({ id: user_id }, jwtSecret);
                res.cookie('jwtCookie', token, cookieConfig);
                res.json({ success: true, cookieId: req.cookies.saveId });
            }

        }   
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: '로그인 실패' });
    }
};


exports.userRegister = async (req, res) => {
    try {
        console.log(req.body);

        const hashedPw = bcrypt.hashSync(req.body.user_password, 10);
        await UserSchema.create({
            user_id: req.body.user_id,
            user_password: hashedPw,
            user_email: req.body.user_email,
        });
        
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: '회원가입 실패' });
    }
};


exports.userIdDuplicate = async(req,res)=>{

    try{
        console.log(req.body);
        const {user_id}= req.body;
        const user = await UserSchema.findOne({
            user_id:user_id
        })
        if (!user){
            res.send({success:true, message:'사용가능한 아이디입니다.'})
        }else{
            res.send({success:false, message:'중복되는 아이디가 있습니다.'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: '회원가입 실패' });
    }
}

exports.userFindId = async(req,res)=>{

    try{
        console.log(req.body);
        const {user_email,user_password}= req.body;
        const user = await UserSchema.findOne({
            user_password:user_password,
            user_email:user_email
        })
        if (!user){
            res.send({success:false})
        }else{
            res.send({success:true,userInfo:user})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: '아이디 찾기 실패' });
    }
}

exports.userFindPw = async(req,res)=>{

    try{
        console.log(req.body);
        const {user_email,user_id}= req.body;
        const user = await UserSchema.findOne({
            user_id:user_id,
            user_email:user_email
        })
        console.log(user);
        if (!user){
            res.send({success:false})
        }else{
            res.send({success:true,userInfo:user})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: '비밀번호 찾기 실패' });
    }
}

exports.userChangePw = async(req,res)=>{

    try{
        console.log(req.body);
        const {user_password,user_id}= req.body;
        const hashedPw = bcrypt.hashSync(user_password, 10);
        const user = await UserSchema.updateOne({
            user_id:user_id,
        },{
            $set:{user_password:hashedPw}
        })
        if (!user){
            res.send({success:false})
        }else{
            res.send({success:true,userInfo:user})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({ success: false, error: '비밀번호 찾기 실패' });
    }
}


