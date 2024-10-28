const router = require("express").Router();
const StatsAPI = require("../controllers/sellerStatsControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.get(
  "/:shopId",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.getAllDataForStats
);

router.get(
  "/:shopId/:selectedYear",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.fetchDataByYear
);

router.get(
  "/:shopId/:selectedYear/:selectedMonth",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.fetchProductDataByMonth
);

router.post(
  "/:shopId/products/sold",
  verifyToken,
  checkPermission("dashboard_actions"),
  StatsAPI.fetchRevenueWithStart2End
);

module.exports = router;
