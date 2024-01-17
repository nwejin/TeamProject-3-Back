const Cuser = require("../controllers/Cuser");
const router = require("express").Router;

router.get("/createUser", Cuser.userInsert);

module.exports = router;
