const express = require("express");
const router = express.Router();
const shippingPartnerAPI = require("../controllers/shippingPartnersControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.post("/", verifyToken, shippingPartnerAPI.createShippingPartner);
router.get("/", shippingPartnerAPI.getAllShippingPartners);
router.get("/:id", shippingPartnerAPI.getShippingPartnerById);
router.put("/:id", shippingPartnerAPI.updateShippingPartner);
router.delete("/:id", shippingPartnerAPI.deleteShippingPartner);

module.exports = router;
