const Cuser = require("../controllers/Cuser");
const router = require("express").Router();
const cors = require("cors");

router.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// 프론트엔드에 데이터를 전송하는 엔드포인트
router.get('/api/data', (req, res) => {
    // 여기서 필요한 데이터를 조회하거나 가공합니다.
    const responseData = 'Hello from the backend!';
  
    res.json(responseData);
  });


router.get("/createUser", Cuser.userInsert);

// 로그인 기능
router.post("/login", Cuser.userLogin);

// 회원가입 기능
router.post("/register", Cuser.userRegister);

// 아이디 중복체크
router.post("/idDuplicate", Cuser.userIdDuplicate);

// 아이디 찾기
router.post("/findId", Cuser.userFindId);

// 비밀번호 찾기
router.post("/findPw", Cuser.userFindPw);

// 비밀번호 변경하기
router.post("/changePw", Cuser.userChangePw);


module.exports = router;
