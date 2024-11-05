const voucherAPI = require("../controllers/voucherControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

//middleware
router.post(
  "/",
  verifyToken,
  checkPermission("seller_actions"),
  voucherAPI.createVoucher
);
router.get("/:shopId", voucherAPI.getAllVouchers);
router.get("/:id", verifyToken, voucherAPI.getAllSingleVouchers);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("seller_actions"),
  voucherAPI.deleteVoucher
);
router.put(
  "/:id",
  verifyToken,
  checkPermission("seller_actions"),
  voucherAPI.updateVoucher
);
router.post(
  "/apply",
  verifyToken,
  checkPermission("create"),
  voucherAPI.applyVoucherToPayment
);
module.exports = router;
