const inventoryAPI = require("../controllers/inventoryControllers");
const router = require("express").Router();
const multer = require("multer");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

let upload = multer({
  storage: storage,
}).single("image");

router.post(
  "/",
  upload,
  verifyToken,
  checkPermission("dashboard_actions"),
  inventoryAPI.createProductInInventory
);
router.get(
  "/",
  verifyToken,
  checkPermission("dashboard_actions"),
  inventoryAPI.fetchInventorys
);
router.post("/transfer-to-menu", inventoryAPI.postProductToMenu);
router.post("/remove-from-menu", inventoryAPI.removeProductFromMenu);
router.delete(
  "/:id/:shopId",
  verifyToken,
  // checkPermission("dashboard_actions"),
  inventoryAPI.deleteProductFromInventory
);
router.get("/:id/:shopId", inventoryAPI.fetchProductByID);
router.patch(
  "/:id/:shopId",
  verifyToken,
  checkPermission("dashboard_actions"),
  upload,
  inventoryAPI.updateProductInInventory
);

module.exports = router;
