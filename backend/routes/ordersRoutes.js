const orderAPI = require("../controllers/orderControllers");
const checkCancelCount = require("../middleware/checkCancelCount");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware

router.post(
  "/",
  verifyToken,
  checkCancelCount,
  checkPermission("create_order"),
  orderAPI.createOrder
);

router.patch(
  "/cancel-order",
  verifyToken,
  checkCancelCount,
  checkPermission("create_order"),
  orderAPI.cancelOrder
);

router.get(
  "/allOrder",
  verifyToken,
  checkPermission("read"),
  orderAPI.fetchAllOrder
);
router.get(
  "/allOrder/admin",
  verifyToken,
  checkPermission("read"),
  orderAPI.getAllOrdersAdmin
);
router.get("/:id", verifyToken, checkPermission("read"), orderAPI.getOrderById);
router.get(
  "/order-user/:userId",
  verifyToken,
  checkPermission("read"),
  orderAPI.getUserOrders
);

router.patch("/:orderId/add-order-request", verifyToken, orderAPI.addOrderReq);
router.patch(
  "/:id",
  verifyToken,
  checkPermission("manage_orders"),
  orderAPI.updateOrderStatus
);
router.get(
  "/reports/today",
  verifyToken,
  checkPermission("report_today"),
  orderAPI.reportRevenueToday
);
module.exports = router;
