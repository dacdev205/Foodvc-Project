const express = require("express");
const router = express.Router();
const PermissionAPI = require("../controllers/permissionControllers");

router.post("/", PermissionAPI.createPermission);

router.get("/", PermissionAPI.getAllPermissions);

router.get("/:name", PermissionAPI.getPermissionByName);

router.put("/:name", PermissionAPI.updatePermission);

router.delete("/:name", PermissionAPI.deletePermission);

module.exports = router;
