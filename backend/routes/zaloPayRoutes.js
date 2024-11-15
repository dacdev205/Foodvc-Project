// routes/paymentRoutes.js
const express = require("express");
const ZaloPayAPI = require("../controllers/zaloPayControllers");
const router = express.Router();
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/create-zalopay-order",
  verifyToken,
  checkPermission(["create"]),
  ZaloPayAPI.createZaloPayOrder
);
router.post("/call-back", ZaloPayAPI.handlePaymentCallback);
module.exports = router;
