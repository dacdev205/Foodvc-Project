const Review = require("../models/reviews");
const Menu = require("../models/menu");
const Shop = require("../models/shop");
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
    try {
      const { productId, userId, rating, comment } = req.body;

      const menu = await Menu.findOne({ _id: productId });
      if (!menu) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      const newReview = await Review.create({
        productId: menu.productId,
        userId,
        rating,
        comment,
      });

      menu.reviews.push(newReview._id);
      await menu.save();

      const shop = await Shop.findById(menu.shopId);
      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      const menus = await Menu.find({ shopId: shop._id });

      let totalRating = 0;
      let totalReviews = 0;

      for (const menuItem of menus) {
        const reviews = await Review.find({ _id: { $in: menuItem.reviews } });
        const productRatingSum = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        totalRating += productRatingSum;
        totalReviews += reviews.length;
      }

      const shopRating = totalReviews > 0 ? totalRating / totalReviews : 0;
      shop.shop_rating = shopRating;
      await shop.save();

      res.status(201).json({
        message: "Review added successfully",
        review: newReview,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getReviewsByProductId(req, res) {
    const productId = req.params.productId;
    try {
      const reviews = await Review.find({ productId }).populate("userId");
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
    const { rating, comment, isEdited } = req.body;
    try {
      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        { rating, comment, isEdited },
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
