const Shop = require("../models/shop");
const Menu = require("../models/menu");
const User = require("../models/user");
const Role = require("../models/roles");
const Review = require("../models/reviews");
const Product = require("../models/product");
const CommissionTier = require("../models/comissionTier");
const fs = require("fs");
const wishStore = require("../models/wishStore");
const { encrypt, decrypt } = require("../utils/cryptoUtils");
const {
  calculateShopRevenue,
  getShopCommission,
} = require("../utils/calculateShopRevenue");
module.exports = class shopAPI {
  static async createShop(req, res) {
    try {
      const email = req.decoded.email;
      const user = await User.findOne({ email }).populate("roles");

      if (!user) {
        return res.status(401).json({ message: "Không có quyền truy cập" });
      }

      const ownerId = user._id;
      let shop_image = req.file ? req.file.filename : "";

      const existingShop = await Shop.findOne({ shopName: req.body.shopName });
      if (existingShop) {
        return res.status(400).json({ message: "Tên cửa hàng đã tồn tại" });
      }

      const encryptedShopToken = encrypt(req.body.shop_token_ghn);

      const retailCommissionPolicy = await CommissionTier.findOne({
        name: "Bán lẻ",
      });

      if (!retailCommissionPolicy) {
        return res.status(400).json({
          message: 'Chính sách hoa hồng "Bán lẻ" không tồn tại.',
        });
      }

      const newShop = new Shop({
        ownerId,
        shopGHN_id: req.body.shopGNN_id,
        shippingPartner: req.body.shippingPartner,
        shopName: req.body.shopName,
        shop_image,
        shop_id_ghn: req.body.shop_id_ghn,
        shop_token_ghn: encryptedShopToken,
        shop_isOpen: req.body.shop_isOpen ?? true,
        shop_isActive: req.body.shop_isActive ?? true,
        shop_rating: req.body.shop_rating ?? 0,
        description: req.body.description,
        inventories: req.body.inventories || [],
        addresses: req.body.addresses || [],
        commissionPolicy: retailCommissionPolicy._id,
      });

      await newShop.save();

      user.shops.push(newShop._id);
      user.isSeller = true;

      const sellerRole = await Role.findOne({ name: "seller" });
      if (
        sellerRole &&
        !user.roles.some(
          (role) => role._id.toString() === sellerRole._id.toString()
        )
      ) {
        user.roles.push(sellerRole._id);
      }

      await user.save();

      res.status(201).json(newShop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllShops(req, res) {
    try {
      const { page = 1, limit = 10, searchTerm = "" } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const searchFilter = searchTerm
        ? { shopName: { $regex: searchTerm, $options: "i" } }
        : {};

      const totalShops = await Shop.countDocuments(searchFilter);

      const shops = await Shop.find(searchFilter)
        .populate("commissionPolicy")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

      res.status(200).json({
        shops,
        totalPages: Math.ceil(totalShops / limitNumber),
        currentPage: pageNumber,
      });
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
      description,
      inventories,
      addresses,
    } = req.body;

    try {
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại" });
      }

      if (shopName) shop.shopName = shopName;
      if (shop_isOpen !== undefined) shop.shop_isOpen = shop_isOpen;
      if (shop_isActive !== undefined) shop.shop_isActive = shop_isActive;
      if (description) shop.description = description;
      if (inventories) shop.inventories = inventories;
      if (addresses) shop.addresses = addresses;

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
  static async updateShopStatus(req, res) {
    try {
      const { shop_isActive } = req.body;
      const { shopId } = req.params;
      const updatedShop = await Shop.findByIdAndUpdate(
        shopId,
        { shop_isActive },
        { new: true }
      );

      if (!updatedShop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      res.status(200).json({
        message: "Shop status updated successfully",
        shop: updatedShop,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to update shop status",
        error: error.message,
      });
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
  static async updateShopCommissionPolicy(req, res) {
    try {
      const shopId = req.params.shopId;
      const shop = await Shop.findById(shopId);

      if (!shop) {
        return res.status(404).json({ message: "Cửa hàng không tồn tại." });
      }

      const shopRevenue = await calculateShopRevenue(shop._id);

      let newCommissionPolicy;

      if (shopRevenue >= 20000000) {
        newCommissionPolicy = await CommissionTier.findOne({
          name: "Bạch kim",
        });
      } else if (shopRevenue >= 15000000) {
        newCommissionPolicy = await CommissionTier.findOne({ name: "Vàng" });
      } else if (shopRevenue >= 5000000) {
        newCommissionPolicy = await CommissionTier.findOne({ name: "Bạc" });
      } else {
        newCommissionPolicy = await CommissionTier.findOne({ name: "Bán lẻ" });
      }

      if (!newCommissionPolicy) {
        return res
          .status(400)
          .json({ message: "Không tìm thấy chính sách hoa hồng." });
      }

      console.log(newCommissionPolicy); // In ra chính sách hoa hồng được áp dụng
      shop.commissionPolicy = newCommissionPolicy._id;
      await shop.save();

      res.status(200).json(shop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
  static async getShopCommissionPolicy(req, res) {
    try {
      const { shopId } = req.params;
      const commissionData = await getShopCommission(shopId);
      res.status(200).json(commissionData);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
