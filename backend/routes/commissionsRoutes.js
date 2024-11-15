const express = require("express");
const router = express.Router();
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const CommissionTierAPI = require("../controllers/commissionTierControllers");

router.post(
  "/",
  verifyToken,
  checkPermission(["admin_actions"]),
  CommissionTierAPI.createCommissionTier
);

router.get(
  "/",
  verifyToken,
  checkPermission(["read"]),
  CommissionTierAPI.getAllCommissionTiers
);
router.get(
  "/for-user",
  verifyToken,
  checkPermission(["read"]),
  CommissionTierAPI.getAllCommissionTiers4User
);

router.get("/:id", CommissionTierAPI.getCommissionTierById);

router.put(
  "/:id",
  verifyToken,
  checkPermission(["admin_actions"]),
  CommissionTierAPI.updateCommissionTier
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission(["admin_actions"]),
  CommissionTierAPI.deleteCommissionTier
);

module.exports = router;
