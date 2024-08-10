const router = require("express").Router();
const addressAPI = require("../controllers/addressControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
//import modal
router.post(
  "/",
  verifyToken,
  checkPermission("create_address"),
  addressAPI.createAddress
);
router.get("/", verifyToken, addressAPI.fetchAllAddressWithEmail);
router.get("/:id", verifyToken, addressAPI.fetchAddressByID);
router.patch(
  "/:id",
  verifyToken,
  checkPermission("update_address"),
  addressAPI.updateAddress
);
router.delete(
  "/:id",
  verifyToken,
  checkPermission("delete_address"),
  addressAPI.deleteAddressByID
);

router.patch(
  "/isDefault/:id",
  verifyToken,
  checkPermission("update_address"),
  addressAPI.updateAddressDefault
);
router.patch(
  "/:id/setDefault",
  verifyToken,
  checkPermission("update_address"),
  addressAPI.setDefaultAddress
);

module.exports = router;
