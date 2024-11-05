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
  checkPermission("create"),
  cartAPI.postProductToCart
);
router.patch(
  "/:cartId/product/:productId",
  verifyToken,
  checkPermission("update"),
  cartAPI.updateProductInCart
);
router.delete(
  "/:cartId/product/:productId",
  verifyToken,
  checkPermission("delete"),
  cartAPI.deleteProductInCart
);

module.exports = router;
