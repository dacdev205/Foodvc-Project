const express = require("express");
const router = express.Router();
const RoleAPI = require("../controllers/roleControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");
router.post(
  "/",
  verifyToken,
  checkPermission(["admin_pages"]),
  RoleAPI.createRole
);
router.get("/", verifyToken, checkPermission(["read"]), RoleAPI.getAllRoles);
router.get("/:id", RoleAPI.getRoleById);
router.delete(
  "/:roleId",
  verifyToken,
  checkPermission(["admin_pages"]),
  RoleAPI.deleteRole
);
router.put(
  "/:roleId",
  verifyToken,
  checkPermission(["admin_pages"]),
  RoleAPI.updateRole
);
module.exports = router;
