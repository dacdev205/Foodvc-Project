const express = require("express");
const router = express.Router();
const PermissionAPI = require("../controllers/permissionControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken,
  checkPermission(["admin_actions"]),
  PermissionAPI.createPermission
);

router.get("/", PermissionAPI.getAllPermissions);
router.get("/zz", PermissionAPI.getAllPermissionsSelect);

router.get(
  "/:name",
  verifyToken,
  checkPermission(["read"]),
  PermissionAPI.getPermissionByName
);

router.put(
  "/:id",
  verifyToken,
  checkPermission(["admin_pages"]),
  PermissionAPI.updatePermission
);

router.delete(
  "/:id",
  verifyToken,
  checkPermission(["admin_pages"]),
  PermissionAPI.deletePermission
);

module.exports = router;
