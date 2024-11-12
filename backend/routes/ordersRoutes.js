const orderAPI = require("../controllers/orderControllers");
const checkCancelCount = require("../middleware/checkCancelCount");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware

router.post("/", verifyToken, checkCancelCount, orderAPI.createOrder);

router.patch(
  "/cancel-order",
  verifyToken,
  checkCancelCount,
  checkPermission("update"),
  orderAPI.cancelOrder
);

router.get(
  "/allOrder",
  verifyToken,
  // checkPermission("seller_actions"),
  // checkPermission("admin_actions"),

  orderAPI.fetchAllOrder
);
router.get(
  "/allOrder/admin",
  // verifyToken,
  // checkPermission("admin_actions"),
  orderAPI.getAllOrdersAdmin
);
router.get("/:id", verifyToken, checkPermission("read"), orderAPI.getOrderById);
router.get("/order-user/:userId", verifyToken, orderAPI.getUserOrders);

router.patch(
  "/:orderId/add-order-request",
  verifyToken,
  checkPermission("create"),
  orderAPI.addOrderReq
);
router.patch(
  "/:id",
  verifyToken,
  checkPermission("update"),
  orderAPI.updateOrderStatus
);
router.get(
  "/reports/today",
  verifyToken,
  checkPermission("create"),
  orderAPI.reportRevenueToday
);
module.exports = router;
