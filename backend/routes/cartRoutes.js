const cartAPI = require("../controllers/cartControllers");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/user/:id", cartAPI.fetchAllProductsByUserId);
router.get("/:id", cartAPI.fetchProductInCartByID);
router.post("/", cartAPI.postProductToCart);
router.patch("/:cartId/product/:productId", cartAPI.updateProductInCart);
router.delete("/:cartId/product/:productId", cartAPI.deleteProductInCart);

module.exports = router;
