const Cuser = require("../controllers/Cuser");
const Cnews = require("../controllers/Cnews");
const router = require("express").Router();

router.get("/createUser", Cuser.userInsert);
router.get("/getnews", Cnews.getNewsList);
router.get("/savenews", Cnews.saveNewsData);

module.exports = router;
