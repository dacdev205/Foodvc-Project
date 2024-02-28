const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers")
//import modal
router.get("/",StatsAPI.getAllDataForStats)
module.exports = router