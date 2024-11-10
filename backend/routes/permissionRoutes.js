const express = require("express");
const router = express.Router();
const PermissionAPI = require("../controllers/permissionControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.post("/", PermissionAPI.createPermission);

router.get("/", PermissionAPI.getAllPermissions);

router.get("/:name", PermissionAPI.getPermissionByName);

router.put("/:id", PermissionAPI.updatePermission);

router.delete("/:id", PermissionAPI.deletePermission);

module.exports = router;
