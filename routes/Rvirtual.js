const router = require('express').Router();
const Csell = require('../controllers/CSell');

router.post('/profit', Csell.post_profit);
router.post('/record', Csell.post_showRecord);
router.post('/profitandloss', Csell.post_ProfitAndLoss);
router.get('/vocabulary', Csell.get_vocabulary);

module.exports = router;
