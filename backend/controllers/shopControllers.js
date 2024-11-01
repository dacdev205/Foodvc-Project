const Shop = require("../models/shop");
const Menu = require("../models/menu");
const User = require("../models/user");
const Role = require("../models/roles");
const Review = require("../models/reviews");
const Product = require("../models/product");
module.exports = class shopAPI {
  static async createShop(req, res) {
    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: "Không có quyền truy cập" });
      }

      const ownerId = user._id;
      let shop_image = req.file ? req.file.filename : "";

      const existingShop = await Shop.findOne({ shopName: req.body.shopName });
      if (existingShop) {
        return res.status(400).json({ message: "Tên cửa hàng đã tồn tại" });
      }

      const newShop = new Shop({
        ownerId,
        shopName: req.body.shopName,
        shop_image,
        shop_isOpen: req.body.shop_isOpen ?? true,
        shop_isActive: req.body.shop_isActive ?? true,
        shop_wallet: req.body.shop_wallet ?? "",
        shop_rating: req.body.shop_rating ?? 0,
        description: req.body.description,
        inventories: req.body.inventories || [],
        addresses: req.body.addresses || [],
        shopRank: req.body.shopRank || null,
      });

      await newShop.save();

      user.shops.push(newShop._id);
      user.isSeller = true;

      const sellerRole = await Role.findOne({ name: "seller" });
      if (sellerRole && !user.roles.includes(sellerRole._id)) {
        user.roles.push(sellerRole._id);
      }

      await user.save();

      res.status(201).json(newShop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllShops(req, res, next) {
    try {
      const shops = await Shop.find();
      res.status(200).json(shops);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getShopById(req, res) {
    try {
      const shop = await Shop.findById(req.params.shopId).populate("addresses");

      if (!shop) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }

      const { searchTerm = "", page = 1, limit = 5 } = req.query;

      let query = { shopId: shop._id };

      if (searchTerm) {
        const productIdsByName = await Product.find({
          name: { $regex: searchTerm, $options: "i" },
        }).select("_id");

        if (!productIdsByName.length) {
          return res.status(200).json({
            shop,
            menuDetails: [],
            totalPages: 0,
            currentPage: page,
          });
        }

        query["productId"] = { $in: productIdsByName.map((p) => p._id) };
      }

      const menus = await Menu.find(query)
        .populate({
          path: "productId",
          select: "name price description image category",
        })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      if (!menus.length) {
        return res.status(200).json({
          shop,
          menuDetails: [],
          totalPages: 0,
          currentPage: page,
        });
      }

      const totalMenus = await Menu.countDocuments(query);
      const totalPages = Math.ceil(totalMenus / limit);
      const menuDetails = await Promise.all(
        menus.map(async (menu) => {
          const populatedReviews = await Review.find({
            _id: { $in: menu.reviews },
          });

          return {
            product: menu.productId,
            quantity: menu.quantity,
            reviews: populatedReviews,
          };
        })
      );

      res.status(200).json({
        shop,
        menuDetails,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateShop(req, res) {
    try {
      const updatedShop = await Shop.findByIdAndUpdate(
        req.params.shopId,
        req.body,
        { new: true }
      );
      if (!updatedShop) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }
      res.status(200).json(updatedShop);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async deleteShop(req, res) {
    try {
      const deletedShop = await Shop.findByIdAndDelete(req.params.shopId);
      if (!deletedShop) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }
      res.status(204).json({ message: "Đã xóa cửa hàng thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
