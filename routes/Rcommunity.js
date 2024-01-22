const Ccommunity = require('../controllers/Ccommunity');
const router = require('express').Router();
const cors = require('cors');

router.use(cors());

router.get('/community', Ccommunity.community);

// 글 읽기
// 글 추가
router.post('/community/uploadPost', Ccommunity.communityInsert);
// 글 삭제

module.exports = router;
