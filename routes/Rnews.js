const Cnews = require('../controllers/Cnews');
const router = require('express').Router();

router.get('/', Cnews.sendEconomyNews);

router.get('/stock', Cnews.sendStockNews);
router.get('/coin', Cnews.sendCoinNews);
router.get('/economy', Cnews.sendEconomyNews);

router.get('/reset', Cnews.resetNewsList);
router.get('/getstock', Cnews.getStockNews);
router.get('/getcoin', Cnews.getCoinNews);
router.get('/geteconomy', Cnews.getEconomyNews);

router.get('/getWords', Cnews.getWords);

router.get('/checkMyWord', Cnews.checkMyWord);
router.post('/saveMyWord', Cnews.saveMyWord);

router.get('/checkMyNews', Cnews.checkMyNews);
router.post('/saveMyNews', Cnews.saveMyNews);

// 메인페이지 뉴스 2개 가져오기
router.get('/mainNews', Cnews.getMainNews);

// 유저가 좋아요한 단어 가져오기
router.post('/likedWords', Cnews.getMyWords);

// 단어 좋아요 취소하기
router.post('/deleteWords', Cnews.deleteMyWords);

module.exports = router;
