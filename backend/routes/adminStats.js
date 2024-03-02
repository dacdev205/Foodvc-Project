const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers")
router.get("/",StatsAPI.getAllDataForStats)
router.get("/:selectedYear", StatsAPI.fetchDataByYear);
router.get("/:selectedYear/:selectedMonth", StatsAPI.fetchProductDataByMonth);
module.exports = router