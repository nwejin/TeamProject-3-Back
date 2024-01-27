const Cmypage = require('../controllers/Cmypage');
const router = require('express').Router();

router.post('/UserModify', Cmypage.UserModify);
router.get('/hi', Cmypage.hi);

module.exports = router;
