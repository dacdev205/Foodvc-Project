const express = require("express");
const orderRequestAPI = require("../controllers/orderRequestControllers");
const verifyToken = require("../middleware/verifyToken");
const checkPermission = require("../middleware/checkPermission");
const router = express.Router();

router.post(
  "/cancel-request",
  verifyToken,
  checkPermission("create"),
  orderRequestAPI.createCancelRequest
);
router.get(
  "/all-requests",
  verifyToken,
  checkPermission("read"),
  orderRequestAPI.getAllRequests
);
router.get(
  "/cancel-request/:id",
  verifyToken,
  checkPermission("read"),
  orderRequestAPI.getRequestById
);
router.put(
  "/cancel-request/:id",
  verifyToken,
  checkPermission("update"),
  orderRequestAPI.updateRequestStatus
);
router.delete(
  "/cancel-request/:id",
  verifyToken,
  checkPermission("delete"),
  orderRequestAPI.deleteRequest
);
module.exports = router;
