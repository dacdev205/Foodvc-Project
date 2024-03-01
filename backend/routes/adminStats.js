const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers")
router.get("/",StatsAPI.getAllDataForStats)
router.get("/:selectedYear", StatsAPI.fetchDataByYear);
module.exports = router