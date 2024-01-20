const Cuser = require("../controllers/Cuser");
const Cnews = require("../controllers/Cnews");
const router = require("express").Router();

router.get("/", (req, res) => {
    // 서버에서 클라이언트로 응답 보내기
    res.json({ message: "Hello from the server!" });
});

router.get("/createUser", Cuser.userInsert);
router.get("/news", Cnews.getNewsList);
router.get("/savenews", Cnews.saveNewsData);

// 로그인 기능
router.post("/login", Cuser.userLogin);

// 회원가입 기능
router.post("/register", Cuser.userRegister);

module.exports = router;
