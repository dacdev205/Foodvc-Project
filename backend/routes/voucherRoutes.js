const voucherAPI = require("../controllers/voucherControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

//middleware
router.post(
  "/",
  verifyToken,
  checkPermission(["seller_actions"]),
  voucherAPI.createVoucher
);
router.get(
  "/:shopId",
  verifyToken,
  checkPermission(["seller_actions"]),
  voucherAPI.getAllVouchers
);
router.get("/user/:shopId", verifyToken, voucherAPI.getVoucher4User);

router.get("/:id", verifyToken, voucherAPI.getAllSingleVouchers);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["seller_actions"]),
  voucherAPI.deleteVoucher
);
router.patch(
  "/:id",
  verifyToken,
  checkPermission(["seller_actions"]),
  voucherAPI.updateVoucher
);
router.patch(
  "/update-quantity/:id",
  verifyToken,
  checkPermission(["seller_actions"]),
  voucherAPI.updateQuantityVoucher
);
router.post(
  "/apply",
  verifyToken,
  checkPermission(["create"]),
  voucherAPI.applyVoucherToPayment
);
module.exports = router;
