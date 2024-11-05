const productsAPI = require("../controllers/productsControllers");
const router = require("express").Router();
const multer = require("multer");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
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

router.patch("/:id/:shopId", verifyToken, upload, productsAPI.updateProduct);
router.get("/:id", verifyToken, productsAPI.fetchProductByID);

module.exports = router;
