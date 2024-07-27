const Review = require("../models/reviews");
const Menu = require("../models/menu");
module.exports = class reviewAPI {
  static async getAllReviews(req, res) {
    try {
      const reviews = await Review.find({});
      res.status(200).json(reviews);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async addReview(req, res) {
    const { productId, userId, userName, rating, comment } = req.body;
    try {
      const review = new Review({
        productId,
        userId,
        userName,
        rating,
        comment,
      });
      await review.save();

      const menu = await Menu.findById(productId);
      menu.reviews.push(review);
      await menu.save();

      res.status(201).json(review);
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async getReviewsByProductId(req, res) {
    const productId = req.params.productId;
    try {
      const reviews = await Review.find({ productId }).populate(
        "userId",
        "displayName"
      );
      res.json(reviews);
    } catch (error) {
      console.error("Error getting reviews:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async getReviewsByReviewId(req, res) {
    const reviewId = req.params.reviewId;
    try {
      const reviews = await Review.findById(reviewId);
      res.json(reviews);
    } catch (error) {
      console.error("Error getting reviews:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async deleteReviewByReviewId(req, res) {
    const reviewId = req.params.reviewId;

    try {
      const deletedReview = await Review.findByIdAndDelete(reviewId);
      if (!deletedReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      const menu = await Menu.findOne({ reviews: deletedReview._id });
      if (menu) {
        menu.reviews.pull(deletedReview._id);
        await menu.save();
      }
      res.json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async updateReviewByReviewId(req, res) {
    const reviewId = req.params.reviewId;
    const { rating, comment } = req.body;
    try {
      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment },
        { new: true }
      );

      if (!updatedReview) {
        return res.status(404).json({ message: "Review not found" });
      }

      res.json({ message: "Review updated successfully", updatedReview });
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
