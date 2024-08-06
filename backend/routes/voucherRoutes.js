const voucherAPI = require("../controllers/voucherControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

//middleware
router.post(
  "/",
  verifyToken,
  checkPermission("dashboard_actions"),
  voucherAPI.createVoucher
);
router.get(
  "/",
  verifyToken,
  checkPermission("read"),
  voucherAPI.getAllVouchers
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("read"),
  voucherAPI.getAllSingleVouchers
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("read"),
  voucherAPI.deleteVoucher
);
router.put(
  "/:id",
  verifyToken,
  checkPermission("dashboard_actions"),
  voucherAPI.updateVoucher
);
router.post(
  "/apply",
  verifyToken,
  checkPermission("read"),
  voucherAPI.applyVoucherToPayment
);
module.exports = router;
