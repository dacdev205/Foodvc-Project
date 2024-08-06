const express = require("express");
const router = express.Router();
const reviewAPI = require("../controllers/reviewControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.post(
  "/",
  verifyToken,
  checkPermission("write_review"),
  reviewAPI.addReview
);
router.get("/:productId", reviewAPI.getReviewsByProductId);
router.get("/", verifyToken, checkPermission("read"), reviewAPI.getAllReviews);
router.delete(
  "/:reviewId",
  verifyToken,
  checkPermission("update_review"),
  reviewAPI.deleteReviewByReviewId
);
router.patch(
  "/:reviewId",
  verifyToken,
  checkPermission("update_review"),
  reviewAPI.updateReviewByReviewId
);
router.get(
  "/editReview/:reviewId",
  verifyToken,
  checkPermission("read"),
  reviewAPI.getReviewsByReviewId
);

module.exports = router;
