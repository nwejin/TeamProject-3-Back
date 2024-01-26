const router = require('express').Router();
const Cbuy = require('../controllers/CSell');

router.post('/profit', Cbuy.post_profit);
router.get('/vocabulary', Cbuy.get_vocabulary);

module.exports = router;
