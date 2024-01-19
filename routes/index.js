const Cuser = require("../controllers/Cuser");
const Cnews = require("../controllers/Cnews");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

// 프론트엔드에 데이터를 전송하는 엔드포인트
router.get("/api/data", (req, res) => {
    // 여기서 필요한 데이터를 조회하거나 가공합니다.
    const responseData = "Hello from the backend!";

    res.json(responseData);
});

router.get("/createUser", Cuser.userInsert);
router.get("/getnews", Cnews.getNewsList);
router.get("/savenews", Cnews.saveNewsData);

// 로그인 기능
router.post("/login", Cuser.userLogin);

// 회원가입 기능
router.post("/register", Cuser.userRegister);

module.exports = router;
