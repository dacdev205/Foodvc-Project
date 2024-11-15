const wishStoreAPI = require("../controllers/wishStoreContrrollers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get(
  "/user/:userId",
  verifyToken,
  wishStoreAPI.fetchAllWishShopWithUserId
);
router.get("/:shopId", verifyToken, wishStoreAPI.fetchStoreWishStoreByShopId);
router.post(
  "/",
  verifyToken,
  checkPermission(["create"]),
  wishStoreAPI.postShopToWishShop
);
router.put(
  "/:id",
  verifyToken,
  checkPermission(["update"]),
  wishStoreAPI.updateShopWishStore
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission(["delete"]),
  wishStoreAPI.deleteShopInWishStore
);

module.exports = router;
