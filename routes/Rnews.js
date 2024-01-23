const Cnews = require("../controllers/Cnews");
const router = require("express").Router();

router.get("/", Cnews.getNewsList);
router.get("/reset", Cnews.resetNewsList);
router.get("/stock", Cnews.getStockNews);
router.get("/coin", Cnews.getCoinNews);
router.get("/economy", Cnews.getEconomyNews);

router.get("/getWords", Cnews.getWords);

module.exports = router;
