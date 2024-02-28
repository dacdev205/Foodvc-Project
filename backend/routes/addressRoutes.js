const router = require("express").Router();
const addressAPI = require("../controllers/addressControllers")
const verifyToken = require("../middleware/verifyToken");

//import modal
router.post("/",addressAPI.createAddress)
router.get("/",verifyToken,addressAPI.fetchAllAddressWithEmail)
router.get("/:id",addressAPI.fetchAddressByID)
router.patch("/:id",addressAPI.updateAddress)
module.exports = router