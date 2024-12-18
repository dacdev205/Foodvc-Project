const express = require("express");
const router = express.Router();
const reviewAPI = require("../controllers/reviewControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.get(
  "/",
  verifyToken,
  checkPermission(["admin_pages"]),
  reviewAPI.getAllReviewsAdmin
);

module.exports = router;
