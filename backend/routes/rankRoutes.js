const express = require("express");
const router = express.Router();
const rankAPI = require("../controllers/rankControllers");
router.post("/add-point", rankAPI.addPointsToUser);

module.exports = router;
