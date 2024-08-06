const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.get(
  "/",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.getAllDataForStats
);
router.get(
  "/:selectedYear",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.fetchDataByYear
);
router.get(
  "/:selectedYear/:selectedMonth",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.fetchProductDataByMonth
);
router.post(
  "/products/sold",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.fetchRevenueWithStart2End
);
module.exports = router;
