const router = require("express").Router();
const StatsAPI = require("../controllers/adminStatsControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.get(
  "/",
  verifyToken,
  checkPermission(["admin_pages"]),
  StatsAPI.getAllDataForStats
);
router.get(
  "/:selectedYear",
  verifyToken,
  checkPermission(["admin_pages"]),
  StatsAPI.fetchDataByYear
);
router.get(
  "/:selectedYear/:selectedMonth",
  verifyToken,
  checkPermission(["admin_pages"]),
  StatsAPI.fetchProductDataByMonth
);
router.post(
  "/products/sold",
  verifyToken,
  checkPermission(["admin_pages"]),
  StatsAPI.fetchRevenueWithStart2End
);
module.exports = router;
