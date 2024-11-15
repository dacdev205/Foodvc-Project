const express = require("express");
const router = express.Router();
const shippingPartnerAPI = require("../controllers/shippingPartnersControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/",
  verifyToken,
  // checkPermission(["admin_pages", "quan_ly_doi_tac_van_chuyen"]),
  shippingPartnerAPI.createShippingPartner
);
router.get(
  "/",
  verifyToken,
  // checkPermission(["read"]),
  shippingPartnerAPI.getAllShippingPartners
);
router.get("/:id", verifyToken, shippingPartnerAPI.getShippingPartnerById);
router.put(
  "/:id",
  verifyToken,
  checkPermission(["admin_pages", "quan_ly_doi_tac_van_chuyen"]),
  shippingPartnerAPI.updateShippingPartner
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["admin_pages", "quan_ly_doi_tac_van_chuyen"]),
  shippingPartnerAPI.deleteShippingPartner
);

module.exports = router;
