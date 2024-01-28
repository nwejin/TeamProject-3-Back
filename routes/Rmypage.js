const Cmypage = require('../controllers/Cmypage');
const router = require('express').Router();

router.post('/getMyInfo', Cmypage.getMyInfo);
router.post('/checkUserNickname', Cmypage.checkUserNickname);
router.post('/checkUserPassword', Cmypage.checkUserPassword);
router.post('/modifyUserInfo', Cmypage.modifyUserInfo);
router.post('/deleteUserinfo', Cmypage.deleteUserinfo);

module.exports = router;
