const favoritePdAPI = require("../controllers/favoritePd");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get(
  "/user/:userId",
  verifyToken,
  favoritePdAPI.fetchAllWishListProductWithUserId
);
router.get(
  "/:productId",
  verifyToken,
  favoritePdAPI.fetchProductWishListByProductId
);
router.post(
  "/",
  verifyToken,
  checkPermission("create"),
  favoritePdAPI.postProductToWishList
);
router.put(
  "/:id",
  verifyToken,
  checkPermission("update"),
  favoritePdAPI.updateProductWishList
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete"),
  favoritePdAPI.deleteProductInWishList
);

module.exports = router;
