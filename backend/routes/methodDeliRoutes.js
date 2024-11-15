const express = require("express");
const router = express.Router();
const methodDeliAPI = require("../controllers/methodDeliControllers");
const vnpayAPI = require("../controllers/vnpayControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/create_method",
  verifyToken,
  checkPermission(["admin_pages"]),
  methodDeliAPI.createMethod
);
router.put(
  "/:id",
  verifyToken,
  checkPermission(["admin_pages"]),
  methodDeliAPI.updateMethod
);
router.get("/all_methods", methodDeliAPI.getAllMethods);
router.get(
  "/all_methods/admin",
  verifyToken,
  checkPermission(["quan_ly_phuong_thuc_thanh_toan", "admin_actions"]),
  methodDeliAPI.getAllMethodsAdmin
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["quan_ly_doi_tac_van_chuyen", "admin_actions"]),
  methodDeliAPI.deleteShippingPartner
);
router.patch(
  "/update-status",
  verifyToken,
  checkPermission(["update"]),
  methodDeliAPI.updateStatus
);
router.post(
  "/vn_pay",
  // verifyToken,
  // checkPermission(["create"]),
  vnpayAPI.createPaymentUrl
);
router.post(
  "/create_refund",
  // verifyToken,
  // checkPermission(["create"]),
  vnpayAPI.createRefundRequest
);
router.get(
  "/vnpay_ipn",
  // verifyToken,
  // checkPermission(["read"]),
  vnpayAPI.vnPayIPN
);
module.exports = router;
