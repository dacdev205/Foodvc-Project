const paymentAPI = require("../controllers/paymentControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get(
  "/",
  verifyToken,
  checkPermission("read"),
  paymentAPI.fetchAllPaymentWithUserId
);
router.get(
  "/:userId",
  verifyToken,
  checkPermission("read"),
  paymentAPI.fetchPaymentByUserID
);
router.post(
  "/",
  verifyToken,
  checkPermission("create_order"),
  paymentAPI.createPayment
);
router.patch(
  "/:id",
  verifyToken,
  checkPermission("update_order"),
  paymentAPI.updateProductInPayment
);

module.exports = router;
