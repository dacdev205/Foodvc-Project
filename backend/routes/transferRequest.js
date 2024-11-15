const transferRequestAPI = require("../controllers/transferRequestControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware

router.post(
  "/",
  verifyToken,
  checkPermission(["create"]),
  transferRequestAPI.requestTransferToMenu
);
router.get(
  "/:shopId",
  verifyToken,
  checkPermission(["seller_actions"]),
  transferRequestAPI.getShopRequestTransferToMenu
);
router.get(
  "/",
  verifyToken,
  checkPermission(["admin_actions", "duyet_san_pham"]),
  transferRequestAPI.getRequestTransferToMenuAdmin
);

module.exports = router;
