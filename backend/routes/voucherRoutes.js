const voucherAPI = require("../controllers/voucherControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = require("express").Router();

//middleware
router.post("/", verifyToken, verifyAdmin, voucherAPI.createVoucher);
router.get("/", verifyToken, voucherAPI.getAllVouchers);
router.get("/:id", voucherAPI.getAllSingleVouchers);
router.delete("/:id", voucherAPI.deleteVoucher);
router.put("/:id", voucherAPI.updateVoucher);
module.exports = router;
