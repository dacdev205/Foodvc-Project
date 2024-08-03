const paymentAPI = require("../controllers/paymentControllers");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/", verifyToken, paymentAPI.fetchAllPaymentWithUserId);
router.get("/:userId", paymentAPI.fetchPaymentByUserID);
router.post("/", paymentAPI.createPayment);
router.patch("/:id", paymentAPI.updateProductInPayment);

module.exports = router;
