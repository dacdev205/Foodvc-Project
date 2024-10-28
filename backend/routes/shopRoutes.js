const shopAPI = require("../controllers/shopControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
const multer = require("multer");

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
//middleware

router.post("/create-shop", upload, verifyToken, shopAPI.createShop);
router.get("/get-shop/:shopId", shopAPI.getShopById);

module.exports = router;
