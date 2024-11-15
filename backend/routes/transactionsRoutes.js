const transactionAPI = require("../controllers/transactionControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.post(
  "/",
  verifyToken,
  checkPermission(["create"]),
  transactionAPI.createTransaction
);
router.get(
  "/",
  verifyToken,
  checkPermission(["read"]),
  transactionAPI.getTransactionsByShop
);
router.get(
  "/admin",
  verifyToken,
  checkPermission(["admin_actions"]),
  transactionAPI.getTransactionsByAdmin
);
router.get(
  "/:orderCode/check-order-status",
  verifyToken,
  checkPermission(["read"]),
  transactionAPI.checkOrderStatus
);
module.exports = router;
