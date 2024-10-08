const express = require("express");
const router = express.Router();
const methodDeliAPI = require("../controllers/methodDeliControllers");
const vnpayAPI = require("../controllers/vnpayControllers");
router.post("/create_method", methodDeliAPI.createMethod);
router.get("/all_methods", methodDeliAPI.getAllMethods);
router.post("/vn_pay", vnpayAPI.createPaymentUrl);
router.get("/vnpay_ipn", vnpayAPI.vnPayIPN);
module.exports = router;
