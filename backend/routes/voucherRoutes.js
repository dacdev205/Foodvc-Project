const voucherAPI = require("../controllers/voucherControllers");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = require("express").Router();

//middleware
router.post("/", voucherAPI.createVoucher);
router.get("/", voucherAPI.getAllVouchers);
router.get("/:id", voucherAPI.getAllSingleVouchers);
router.delete("/:id", voucherAPI.deleteVoucher);
router.put("/:id", voucherAPI.updateVoucher);
router.post("/apply", voucherAPI.applyVoucherToPayment);
module.exports = router;
