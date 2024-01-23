const Ccommunity = require('../controllers/Ccommunity');
const router = require('express').Router();

router.get('/', Ccommunity.community);

// 글 추가
router.post('/write', Ccommunity.communityWrite);

// 글 읽기
router.get('/read', Ccommunity.communityRead);
// 글 삭제

module.exports = router;
