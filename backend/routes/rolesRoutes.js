const express = require("express");
const router = express.Router();
const RoleAPI = require("../controllers/roleControllers");
router.post("/", RoleAPI.createRole);
router.get("/", RoleAPI.getAllRoles);
router.get("/:id", RoleAPI.getRoleById);
router.delete("/:roleId", RoleAPI.deleteRole);
router.put("/:roleId", RoleAPI.updateRole);
module.exports = router;
