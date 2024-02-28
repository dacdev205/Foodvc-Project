const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers")
router.get("/",StatsAPI.getAllDataForStats)
module.exports = router