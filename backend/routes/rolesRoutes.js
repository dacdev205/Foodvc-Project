const express = require("express");
const router = express.Router();
const RoleAPI = require("../controllers/roleControllers");
router.post("/", RoleAPI.createRole);
router.get("/:id", RoleAPI.getRoleById);

module.exports = router;
