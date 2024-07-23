const express = require("express");
const router = express.Router();
const reviewAPI = require("../controllers/reviewControllers");

router.post("/", reviewAPI.addReview);
router.get("/:productId", reviewAPI.getReviewsByProductId);
router.get("/", reviewAPI.getAllReviews);
router.delete("/:reviewId", reviewAPI.deleteReviewByReviewId);
router.patch("/:reviewId", reviewAPI.updateReviewByReviewId);
router.get("/editReview/:reviewId", reviewAPI.getReviewsByReviewId);

module.exports = router;
