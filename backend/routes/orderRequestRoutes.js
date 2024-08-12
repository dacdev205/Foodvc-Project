const express = require("express");
const orderRequestAPI = require("../controllers/orderRequestControllers");
const verifyToken = require("../middleware/verifyToken");
const checkPermission = require("../middleware/checkPermission");
const router = express.Router();

router.post(
  "/cancel-request",
  verifyToken,
  checkPermission("cancel_order"),
  orderRequestAPI.createCancelRequest
);
router.get(
  "/all-requests",
  verifyToken,
  checkPermission("dashboard_actions"),
  orderRequestAPI.getAllRequests
);
router.get(
  "/cancel-request/:id",
  verifyToken,
  checkPermission("dashboard_actions"),
  orderRequestAPI.getRequestById
);
router.put(
  "/cancel-request/:id",
  verifyToken,
  checkPermission("dashboard_actions"),
  orderRequestAPI.updateRequestStatus
);
router.delete(
  "/cancel-request/:id",
  verifyToken,
  checkPermission("dashboard_actions"),
  orderRequestAPI.deleteRequest
);
module.exports = router;
