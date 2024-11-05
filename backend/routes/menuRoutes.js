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
router.post("/", upload, menuAPI.createProduct);
router.post("/add-to-menu", upload, menuAPI.createProduct);
router.get("/", menuAPI.fetchMenus);
router.get("/admin", checkPermission("seller_pages"), menuAPI.fetchMenusAdmin);

router.get("/:id", menuAPI.fetchProductByID);
router.patch("/quantity/:id", upload, menuAPI.updateProductQuantityInMenu);
router.patch("/:id", upload, menuAPI.updateProductInMenu);

router.post(
  "/apply-voucher",
  verifyToken,
  checkPermission("create"),
  menuAPI.applyVoucher
);

module.exports = router;
