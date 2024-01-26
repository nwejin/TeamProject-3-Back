const Cmypage = require('../controllers/Cmypage');
const router = require('express').Router();

router.post('/UserModify', Cmypage.UserModify);

module.exports = router;
