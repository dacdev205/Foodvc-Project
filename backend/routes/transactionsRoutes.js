const transactionAPI = require("../controllers/transactionControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.post("/", transactionAPI.createTransaction);
router.get("/", transactionAPI.getTransactionsByShop);
router.get("/admin", transactionAPI.getTransactionsByAdmin);
module.exports = router;
