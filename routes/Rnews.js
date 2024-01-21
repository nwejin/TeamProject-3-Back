const Cnews = require("../controllers/Cnews");
const router = require("express").Router();

router.get("/", Cnews.getNewsList);
router.get("/stock", Cnews.getStockNews);
router.get("/coin", Cnews.getCoinNews);
router.get("/economy", Cnews.getEconomyNews);

module.exports = router;
