const transferRequestAPI = require("../controllers/transferRequestControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware

router.post(
  "/",
  //   verifyToken,
  //   checkPermission("create"),
  transferRequestAPI.requestTransferToMenu
);
router.get("/:shopId", transferRequestAPI.getShopRequestTransferToMenu);
router.get("/", transferRequestAPI.getRequestTransferToMenuAdmin);

module.exports = router;
