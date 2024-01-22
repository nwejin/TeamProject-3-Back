const Ccommunity = require('../controllers/Ccommunity');
const router = require('express').Router();
const cors = require('cors');

router.use(cors());

router.get('/community', Ccommunity.community);
router.post('/community/uploadPost', Ccommunity.communityInsert);

module.exports = router;
