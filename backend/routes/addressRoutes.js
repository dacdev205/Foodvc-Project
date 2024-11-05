const router = require("express").Router();
const addressAPI = require("../controllers/addressControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
//import modal
router.post(
  "/",
  verifyToken,
  checkPermission("create"),
  addressAPI.createAddress
);
router.get(
  "/",
  verifyToken,
  checkPermission("read"),
  addressAPI.fetchAllAddressWithEmail
);
router.get(
  "/:id",
  verifyToken,
  checkPermission("read"),
  addressAPI.fetchAddressByID
);
router.patch(
  "/:id",
  verifyToken,
  checkPermission("update"),
  addressAPI.updateAddress
);
router.delete("/:id", verifyToken, addressAPI.deleteAddressByID);

router.patch(
  "/isDefault/:id",
  checkPermission("update"),
  verifyToken,
  addressAPI.updateAddressDefault
);
router.patch(
  "/:id/setDefault",
  checkPermission("update"),
  verifyToken,
  addressAPI.setDefaultAddress
);

module.exports = router;
