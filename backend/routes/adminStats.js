const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers")
router.get("/",StatsAPI.getAllDataForStats)
router.get("/:selectedYear", StatsAPI.fetchDataByYear);
router.get("/:selectedYear/:selectedMonth", StatsAPI.fetchProductDataByMonth);
router.post("/products/sold", StatsAPI.fetchRevenueWithStart2End);
module.exports = router