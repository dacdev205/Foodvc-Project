const express = require("express");
const router = express.Router();
const recommend = require("../controllers/recommendedControllers");
router.get("/:userId?", recommend.getRecommendedProducts);

module.exports = router;
