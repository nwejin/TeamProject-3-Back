const Cuser = require("../controllers/Cuser");
const Cnews = require("../controllers/Cnews");
const router = require("express").Router();

router.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

router.get("/createUser", Cuser.userInsert);
router.get("/getnews", Cnews.getNewsList);
router.get("/savenews", Cnews.saveNewsData);

// 로그인 기능
router.post("/login", Cuser.userLogin);

// 회원가입 기능
router.post("/register", Cuser.userRegister);

module.exports = router;
