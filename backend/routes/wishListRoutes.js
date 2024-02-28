const favoritePdAPI = require("../controllers/favoritePd")
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();
//middleware
router.get("/",verifyToken,favoritePdAPI.fetchAllWishListProductWithEmail);
router.get("/:id",favoritePdAPI.fetchProductWishListByID);
router.post("/",favoritePdAPI.postProductToWistLish);
router.put("/:id",favoritePdAPI.updateProductWishList);
router.delete("/:id",favoritePdAPI.deleteProductInWishList)

module.exports = router;
