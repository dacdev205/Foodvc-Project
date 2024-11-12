const Review = require("../models/reviews");
const Menu = require("../models/menu");
const Shop = require("../models/shop");
const Product = require("../models/product");
module.exports = class reviewAPI {
  static async getAllReviews(req, res) {
    const {
      page = 1,
      limit = 5,
      shopId,
      searchTerm = "",
      sentiment = "",
    } = req.query;

    if (!shopId) {
      return res.status(400).json({ message: "shopId là bắt buộc" });
    }

    const skip = (page - 1) * limit;

    try {
      const products = await Product.find({ shopId }, "_id");
      const productIds = products.map((product) => product._id);

      const filter = { productId: { $in: productIds } };

      if (searchTerm) {
        filter.comment = { $regex: searchTerm, $options: "i" };
      }

      if (sentiment) {
        filter.sentiment = sentiment;
      }

      const reviews = await Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const totalReviews = await Review.countDocuments(filter);
      const totalPages = Math.ceil(totalReviews / limit);

      const positiveReviews = reviews.filter(
        (review) => review.sentiment === "positive"
      ).length;
      const negativeReviews = reviews.filter(
        (review) => review.sentiment === "negative"
      ).length;
      const positivePercentage = (positiveReviews / totalReviews) * 100 || 0;
      const negativePercentage = (negativeReviews / totalReviews) * 100 || 0;

      res.status(200).json({
        reviews,
        totalReviews,
        positiveReviews,
        negativeReviews,
        positivePercentage,
        negativePercentage,
        totalPages,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getAllReviewsAdmin(req, res) {
    const { page = 1, limit = 5, searchTerm = "", sentiment = "" } = req.query;
    const skip = (page - 1) * limit;
    try {
      let filter = {};

      if (searchTerm) {
        filter.comment = { $regex: searchTerm, $options: "i" };
      }

      if (sentiment) {
        filter.sentiment = sentiment;
      }

      const reviews = await Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

      const totalReviews = await Review.countDocuments(filter);
      const totalPages = Math.ceil(totalReviews / limit);

      const positiveReviews = reviews.filter(
        (review) => review.sentiment === "positive"
      ).length;
      const negativeReviews = reviews.filter(
        (review) => review.sentiment === "negative"
      ).length;
      const positivePercentage = (positiveReviews / totalReviews) * 100 || 0;
      const negativePercentage = (negativeReviews / totalReviews) * 100 || 0;

      // Send response
      res.status(200).json({
        reviews,
        totalReviews,
        positiveReviews,
        negativeReviews,
        positivePercentage,
        negativePercentage,
        totalPages,
      });
    } catch (error) {
      // Log the error for better debugging
      console.error("Error in getAllReviewsAdmin:", error);

      res.status(500).json({
        message: "Internal server error",
        error: error.message, // Include the error message in the response for debugging
      });
    }
  }

  static async addReview(req, res) {
    try {
      const { productId, userId, rating, comment } = req.body;

      const menu = await Menu.findOne({ _id: productId });
      if (!menu) {
        return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
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
        return res.status(404).json({ message: "Shop không tìm thấy" });
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
        message: "Tạo đánh giá thành công",
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
      console.error("Lỗi khi lấy dữ liệu:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async getReviewsByReviewId(req, res) {
    const reviewId = req.params.reviewId;
    try {
      const reviews = await Review.findById(reviewId);
      res.json(reviews);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async deleteReviewByReviewId(req, res) {
    const reviewId = req.params.reviewId;

    try {
      const deletedReview = await Review.findByIdAndDelete(reviewId);
      if (!deletedReview) {
        return res.status(404).json({ message: "Không tìm thấy đánh giá" });
      }

      const menu = await Menu.findOne({ reviews: deletedReview._id });
      if (menu) {
        menu.reviews.pull(deletedReview._id);
        await menu.save();
      }
      res.json({ message: "Đánh giá đã được xóa" });
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá", error);
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
        return res.status(404).json({ message: "Đánh giá không tìm thấy" });
      }

      res.json({ message: "Cập nhật đánh giá thất bại", updatedReview });
    } catch (error) {
      console.error("Cập nhật thất bại", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  static async updateSentimentByReviewId(req, res) {
    const { reviewId, sentiment } = req.body;

    try {
      const review = await Review.findById(reviewId);
      if (!review) {
        return res.status(404).json({ message: "Đánh giá không tìm th" });
      }

      review.sentiment = sentiment;
      await review.save();

      res
        .status(200)
        .json({ message: "Dự đoán cảm tìm đã được cập nhật", review });
    } catch (error) {
      res.status(500).json({ message: "Error updating sentiment", error });
    }
  }
};
