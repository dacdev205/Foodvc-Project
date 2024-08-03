const productsAPI = require("../controllers/productsControllers");
const router = require("express").Router();
const multer = require("multer");
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

router.patch("/:id", upload, productsAPI.updateProduct);
router.get("/:id", productsAPI.fetchProductByID);

module.exports = router;
