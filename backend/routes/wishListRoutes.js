const favoritePdAPI = require("../controllers/favoritePd");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/user/:userId", favoritePdAPI.fetchAllWishListProductWithUserId);
router.get("/:productId", favoritePdAPI.fetchProductWishListByProductId);
router.post("/", favoritePdAPI.postProductToWishList);
router.put("/:id", favoritePdAPI.updateProductWishList);
router.delete("/:id", favoritePdAPI.deleteProductInWishList);

module.exports = router;
