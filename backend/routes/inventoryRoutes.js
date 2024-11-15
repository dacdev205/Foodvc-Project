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

router.post("/", upload, verifyToken, inventoryAPI.createProductInInventory);
router.get(
  "/",
  verifyToken,
  checkPermission(["read"]),
  inventoryAPI.fetchInventorys
);
router.post(
  "/approve-transfer-to-menu/:id",
  verifyToken,
  inventoryAPI.postProductToMenu
);
router.put(
  "/reject-transfer-to-menu/:id",
  verifyToken,
  checkPermission(["admin_pages"]),
  inventoryAPI.rejectTransferToMenu
);
router.post(
  "/remove-from-menu",
  verifyToken,
  checkPermission(["update"]),
  inventoryAPI.removeProductFromMenu
);
router.post(
  "/remove-from-menu-admin",
  verifyToken,
  checkPermission(["admin_pages"]),
  inventoryAPI.removeProductFromMenuAdmin
);
router.delete(
  "/:id/:shopId",
  verifyToken,
  checkPermission(["delete"]),
  inventoryAPI.deleteProductFromInventory
);
router.get(
  "/:id/:shopId",
  verifyToken,
  checkPermission(["read"]),
  inventoryAPI.fetchProductByID
);
router.patch(
  "/:id/:shopId",
  upload,
  verifyToken,
  checkPermission(["seller_actions"]),
  inventoryAPI.updateProductInInventory
);

module.exports = router;
