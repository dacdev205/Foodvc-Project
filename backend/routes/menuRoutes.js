const menuAPI = require("../controllers/menuControllers");
const router = require("express").Router();
const multer = require("multer");
const verifyToken = require("../middleware/verifyToken");
const checkPermission = require("../middleware/checkPermission");

//multer middleware
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
  checkPermission(["create"]),
  menuAPI.createProduct
);
router.post(
  "/add-to-menu",
  verifyToken,
  checkPermission(["create"]),
  upload,
  menuAPI.createProduct
);
router.get("/", menuAPI.fetchMenus);
router.get(
  "/seller",
  verifyToken,
  checkPermission(["seller_pages"]),
  menuAPI.fetchMenusSeller
);
router.get(
  "/admin",
  verifyToken,
  checkPermission(["admin_pages"]),
  menuAPI.fetchMenusAdmin
);
router.get("/:id", menuAPI.fetchProductByID);
router.patch(
  "/quantity/:id",
  verifyToken,
  checkPermission(["seller_pages"]),
  upload,
  menuAPI.updateProductQuantityInMenu
);
router.patch(
  "/:id",
  upload,
  verifyToken,
  checkPermission(["seller_pages"]),
  menuAPI.updateProductInMenu
);

router.post(
  "/apply-voucher",
  verifyToken,
  checkPermission(["create"]),
  menuAPI.applyVoucher
);

module.exports = router;
