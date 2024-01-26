const Cmypage = require('../controllers/Cmypage');
const router = require('express').Router();

router.get('/UserModify', Cmypage.UserModify);

module.exports = router;
