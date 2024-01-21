const Cuser = require("../controllers/Cuser");
const Cindex = require("../controllers/Cindex");
const router = require("express").Router();

router.get("/", () => {
    Cindex.getMain;
});
router.get("/createUser", Cuser.userInsert);

// 로그인 기능
router.post("/login", Cuser.userLogin);

// 회원가입 기능
router.post("/register", Cuser.userRegister);

module.exports = router;
