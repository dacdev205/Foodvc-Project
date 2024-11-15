// RecommendationController.js

const axios = require("axios");
const Menu = require("../models/menu");

async function getRecommendedProducts(req, res) {
  const { userId } = req.params;

  try {
    const response = await axios.get(
      `http://127.0.0.1:5001/recommend${userId ? `?userId=${userId}` : ""}`
    );
    const recommendations = response.data.recommendations;

    const productIds = Object.keys(recommendations);

    const products = await Menu.find({
      productId: { $in: productIds },
    }).populate("productId");

    const recommendedProducts = products.map((product) => ({
      ...product.toObject(),
      recommendationScore: recommendations[product._id.toString()],
    }));

    res.json({
      userId,
      recommendedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không thể lấy sản phẩm được khuyến nghị" });
  }
}

module.exports = {
  getRecommendedProducts,
};
