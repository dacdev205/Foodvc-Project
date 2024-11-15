const express = require("express");
const router = express.Router();
const reviewAPI = require("../controllers/reviewControllers");
const checkPermission = require("../middleware/checkPermission");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, checkPermission(["create"]), reviewAPI.addReview);
router.get("/:productId", reviewAPI.getReviewsByProductId);
router.get(
  "/",
  verifyToken,
  checkPermission(["admin_actions", "quan_ly_danh_gia", "seller_pages"]),
  reviewAPI.getAllReviews
);

router.post(
  "/update-sentiment",
  verifyToken,
  checkPermission(["admin_actions", "quan_ly_danh_gia"]),
  reviewAPI.updateSentimentByReviewId
);
router.delete(
  "/:reviewId",
  verifyToken,
  checkPermission(["delete"]),
  reviewAPI.deleteReviewByReviewId
);
router.patch(
  "/:reviewId",
  verifyToken,
  checkPermission(["update"]),
  reviewAPI.updateReviewByReviewId
);
router.get(
  "/editReview/:reviewId",
  verifyToken,
  checkPermission(["read"]),
  reviewAPI.getReviewsByReviewId
);

module.exports = router;
