const orderAPI = require("../controllers/orderControllers")
const router = require("express").Router();
//middleware

router.post("/",orderAPI.createOrder);
router.get("/",orderAPI.fetchAllOrderWithEmail);
router.get("/allOrder", orderAPI.fetchAllOrder)
router.get("/:id",orderAPI.getOrderById);
router.get("/order-user/:userId", orderAPI.getUserOrders);
router.patch("/:id", orderAPI.updateOrderStatus)
module.exports = router;
