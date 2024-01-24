const router = require('express').Router();
const Cbuy = require('../controllers/CSell');

router.post('/profit', Cbuy.post_profit);

module.exports = router;
