const express = require('express');
const router = express.Router();
const reviewAPI = require('../controllers/reviewControllers');
const verifyToken = require("../middleware/verifyToken");

router.post('/', reviewAPI.addReview);
router.get('/:productId', reviewAPI.getReviewsByProductId);
router.delete('/:reviewId', reviewAPI.deleteReviewByReviewId);
router.patch('/:reviewId', reviewAPI.updateReviewByReviewId);
router.get('/editReview/:reviewId', reviewAPI.getReviewsByReviewId);

module.exports = router;
