const router = require("express").Router();
const StatsAPI = require("../controllers/sellerStatsControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.get("/:shopId", verifyToken, StatsAPI.getAllDataForStats);

router.get("/:shopId/:selectedYear", verifyToken, StatsAPI.fetchDataByYear);

router.get(
  "/:shopId/:selectedYear/:selectedMonth",
  verifyToken,
  StatsAPI.fetchProductDataByMonth
);

router.post(
  "/:shopId/products/sold",
  verifyToken,
  StatsAPI.fetchRevenueWithStart2End
);

module.exports = router;
