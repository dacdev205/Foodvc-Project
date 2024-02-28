const menuAPI = require("../controllers/menuControllers");
const router = require("express").Router();
const multer = require("multer");

//multer middleware
let storage = multer.diskStorage({
    destination: function (req, file,cb) {
        cb(null, "uploads");
    },
    filename: function (req, file,cb) {
        cb(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

let upload = multer({
    storage: storage,
}).single("image")
router.post("/", upload, menuAPI.createProduct);
router.post("/add-to-menu", upload, menuAPI.createProduct);
router.get("/", menuAPI.fetchAllMenu);
router.get("/:id",menuAPI.fetchProductByID);
router.patch("/:id",upload, menuAPI.updateProductInMenu);
router.post("/update-quantity-menu", menuAPI.updateMenuQuantity);
router.post("/apply-voucher",menuAPI.applyVoucher);


module.exports = router;