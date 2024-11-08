const Shop = require("../models/shop");
const Menu = require("../models/menu");
const User = require("../models/user");
const Role = require("../models/roles");
const Review = require("../models/reviews");
const Product = require("../models/product");
const fs = require("fs");
const wishStore = require("../models/wishStore");

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

  static async fetchShopById(req, res) {
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
            favoriteUserIds: [],
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
          favoriteUserIds: [],
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

      const favoriteUsers = await wishStore
        .find({ shop: shop._id })
        .select("userId");
      const favoriteUserIds = favoriteUsers.map((wishlist) => wishlist.userId);

      res.status(200).json({
        shop,
        menuDetails,
        totalPages,
        currentPage: page,
        favoriteUserIds,
      });
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
            favoriteUserIds: [],
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
          favoriteUserIds: [],
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

      const favoriteUsers = await wishStore
        .find({ shopId: shop._id })
        .select("userId");
      const favoriteUserIds = favoriteUsers.map((entry) => entry.userId);

      res.status(200).json({
        shop,
        menuDetails,
        totalPages,
        currentPage: page,
        favoriteUserIds,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateShop(req, res) {
    const shopId = req.params.shopId;

    const {
      shopName,
      shop_isOpen,
      shop_isActive,
      shop_wallet,
      description,
      inventories,
      addresses,
      shopRank,
    } = req.body;

    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }

      if (shopName) shop.shopName = shopName;
      if (shop_isOpen !== undefined) shop.shop_isOpen = shop_isOpen;
      if (shop_isActive !== undefined) shop.shop_isActive = shop_isActive;
      if (shop_wallet) shop.shop_wallet = shop_wallet;
      if (description) shop.description = description;
      if (inventories) shop.inventories = inventories;
      if (addresses) shop.addresses = addresses;
      if (shopRank) shop.shopRank = shopRank;

      if (req.file) {
        if (shop.shop_image) {
          try {
            fs.unlinkSync("./uploads/" + shop.shop_image);
          } catch (err) {
            console.log("Error deleting old image:", err);
          }
        }
        shop.shop_image = req.file.filename;
      }

      await shop.save();

      res
        .status(200)
        .json({ message: "Cửa hàng đã được cập nhật thành công", shop });
    } catch (error) {
      console.error("Error updating shop:", error);
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
