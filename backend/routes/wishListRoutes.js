const favoritePdAPI = require("../controllers/favoritePd");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get(
  "/user/:userId",
  verifyToken,
  checkPermission("read"),
  favoritePdAPI.fetchAllWishListProductWithUserId
);
router.get(
  "/:productId",
  verifyToken,
  checkPermission("read"),
  favoritePdAPI.fetchProductWishListByProductId
);
router.post(
  "/",
  verifyToken,
  checkPermission("read"),
  favoritePdAPI.postProductToWishList
);
router.put(
  "/:id",
  verifyToken,
  checkPermission("read"),
  favoritePdAPI.updateProductWishList
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("read"),
  favoritePdAPI.deleteProductInWishList
);

module.exports = router;
