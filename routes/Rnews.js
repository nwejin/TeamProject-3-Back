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

// 메인페이지 뉴스 2개 가져오기
router.get('/mainNews', Cnews.getMainNews);

// 유저가 좋아요한 단어 가져오기
router.post('/likedWords', Cnews.getMyWords);

// 단어 좋아요 취소하기
router.post('/deleteWords', Cnews.deleteMyWords);

// 저장한 뉴스 가져오기
router.get('/getMyNews', Cnews.getMyNews);

// -------------------------------------------------------------------

router.get('/getWordsDb', Cnews.getWordsDb);

router.get('/checkMyWord', Cnews.checkMyWord);
router.post('/saveMyWord', Cnews.saveMyWord);

router.get('/checkMyNews', Cnews.checkMyNews);
router.post('/saveMyNews', Cnews.saveMyNews);

// 내 형광펜 텍스트 저장
router.post('/myHighlight', Cnews.myHighlight);

// 내 형광펜 텍스트 가져오기
router.get('/getHighlight', Cnews.getHighlight);

// 형광펜 삭제하기
router.post('/deleteHighlight', Cnews.deleteHighlight);

module.exports = router;
