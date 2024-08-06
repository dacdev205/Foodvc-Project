const cartAPI = require("../controllers/cartControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get(
  "/user/:id",
  verifyToken,
  checkPermission("read"),
  cartAPI.fetchAllProductsByUserId
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("read"),
  cartAPI.fetchProductInCartByID
);
router.post(
  "/",
  verifyToken,
  checkPermission("create_cart"),
  cartAPI.postProductToCart
);
router.patch(
  "/:cartId/product/:productId",
  verifyToken,
  checkPermission("update_cart"),
  cartAPI.updateProductInCart
);
router.delete(
  "/:cartId/product/:productId",
  verifyToken,
  checkPermission("delete_cart"),
  cartAPI.deleteProductInCart
);

module.exports = router;
