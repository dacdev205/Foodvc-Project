const WishStore = require("../models/wishStore");
module.exports = class WishStoreAPI {
  static async fetchAllWishShopWithUserId(req, res) {
    try {
      const userId = req.params.userId;

      const wishStore = await WishStore.find({ userId }).populate("shop");
      if (wishStore.length > 0) {
        res.status(200).json(wishStore);
      } else {
        res.status(404).json({
          message:
            "Không tìm thấy cửa hàng nào trong Wishstore cho người dùng này",
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async postShopToWishShop(req, res) {
    const { userId, shop } = req.body;
    try {
      const wishItem = new WishStore({ userId, shop });
      await wishItem.save();
      res.status(201).json(wishItem);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async fetchStoreWishStoreByShopId(req, res) {
    const shopId = req.params.shopId;
    try {
      const wishItem = await WishStore.findOne({ shop: shopId }).populate(
        "shop"
      );
      if (wishItem) {
        res.status(200).json(wishItem);
      } else {
        res
          .status(404)
          .json({ message: "Không tìm thấy cửa hàng trong Wishstore" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateShopWishStore(req, res) {
    const id = req.params.id;
    const updateData = req.body;
    try {
      const existingWishItem = await WishStore.findById(id);
      if (!existingWishItem) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm trong wishStore" });
      }
      existingWishItem.set(updateData);
      await existingWishItem.save();
      res.json(existingWishItem);
    } catch (err) {
      res
        .status(500)
        .json({
          message: "Lỗi khi update sản phẩm trong wishStore",
          error: err,
        });
    }
  }

  static async deleteShopInWishStore(req, res) {
    const { userId } = req.body;
    const shopId = req.params.id;

    try {
      const result = await WishStore.deleteOne({ userId, shop: shopId });
      if (result) {
        res
          .status(200)
          .json({ message: "Đã xóa cửa hàng thành công khỏi Wishstore" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
