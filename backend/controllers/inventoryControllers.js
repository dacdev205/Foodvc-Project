const Inventory = require("../models/inventory");
const fs = require("fs");
const Product = require("../models/product");
const axios = require("axios");
const Menu = require("../models/menu");
const Category = require("../models/category");
const Shop = require("../models/shop");
const TransferRequest = require("../models/transferRequest");
module.exports = class inventoryAPI {
  static async fetchInventorys(req, res) {
    try {
      const {
        searchTerm = "",
        filterType = "name",
        page = 1,
        limit = 5,
        sortBy = "",
        sortOrder = "asc",
        sort = "-createAt",
        shopId,
      } = req.query;

      if (!shopId) {
        return res.status(400).json({ message: "shopId là bắt buộc" });
      }

      const query = { shopId };
      const sortOptions = {};

      if (searchTerm) {
        switch (filterType) {
          case "name":
            query.name = { $regex: searchTerm, $options: "i" };
            break;
          case "category":
            const category = await Category.findOne({
              name: { $regex: searchTerm, $options: "i" },
            });
            if (category) {
              query.category = category._id;
            } else {
              query.category = null;
            }
            break;
          case "brand":
            query.brand = { $regex: searchTerm, $options: "i" };
            break;
          case "productionLocation":
            query.productionLocation = { $regex: searchTerm, $options: "i" };
            break;
          case "instructions":
            query.instructions = { $regex: searchTerm, $options: "i" };
            break;
          default:
            query.name = { $regex: searchTerm, $options: "i" };
            break;
        }
      }

      if (sortBy) {
        sortOptions[sortBy] = sortOrder === "asc" ? -1 : 1;
      }

      const inventory = await Product.find(query)
        .sort({ createdAt: -1 })
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const totalProduct = await Product.countDocuments(query);
      const totalPages = Math.ceil(totalProduct / limit);

      res.json({ inventory, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Fetch product by ID
  static async fetchProductByID(req, res) {
    const { id, shopId } = req.params;
    try {
      const product = await Product.findOne({ _id: id, shopId }).populate(
        "category"
      );
      if (!product) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tìm thấy trong shop" });
      }
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Create product in inventory
  static async createProductInInventory(req, res) {
    const { shopId, ...productData } = req.body;
    const imagename = req.file.filename;
    productData.image = imagename;
    try {
      const product = await Product.create({ ...productData, shopId });

      const inventoryItem = await Inventory.create({
        shopId: shopId,
        productId: product._id,
      });
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: "Không tìm thấy shop" });
      }
      shop.inventories.push(inventoryItem._id);
      await shop.save();

      return res.status(201).json({ product, inventoryItem, shop });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // Post product to menu
  static async postProductToMenu(req, res) {
    try {
      const { id } = req.params;
      const transferRequest = await TransferRequest.findById(id);
      if (!transferRequest) {
        return res
          .status(404)
          .json({ message: "Yêu cầu chuyển không tìm thấy" });
      }

      const { productId, quantity, shopId } = transferRequest;

      const productInInventory = await Product.findOne({
        _id: productId,
        shopId: shopId,
      });

      if (!productInInventory) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tìm thấy trong shop" });
      }

      if (productInInventory.quantity < quantity) {
        return res.status(400).json({ message: "Số lượng sản phẩm không đủ" });
      }

      productInInventory.quantity -= quantity;
      await productInInventory.save();

      await axios.post("http://localhost:3000/api/foodvc/add-to-menu", {
        productId,
        quantity,
        shopId,
      });

      productInInventory.transferredToMenu = true;
      await productInInventory.save();

      transferRequest.status = "approved";
      await transferRequest.save();

      res.status(200).json({ message: "Product transferred successfully" });
    } catch (error) {
      console.error("Lỗi khi chuyển sản phẩm", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async rejectTransferToMenu(req, res) {
    try {
      const { id } = req.params;
      const request = await TransferRequest.findById(id);
      if (!request)
        return res.status(404).json({ message: "Yêu cầu không tồn tại" });

      // Từ chối yêu cầu
      request.status = "rejected";
      await request.save();

      res.status(200).json({ message: "Yêu cầu đã bị từ chối" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi từ chối yêu cầu" });
    }
  }
  // Update product in inventory
  static async updateProductInInventory(req, res) {
    const { id, shopId } = req.params;
    let new_image = "";

    try {
      const existingProduct = await Product.findOne({ _id: id, shopId });

      if (!existingProduct) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tìm thấy trong shop" });
      }

      if (req.file) {
        new_image = req.file.filename;
        try {
          fs.unlinkSync("./uploads/" + existingProduct.image);
        } catch (err) {
          console.log(err);
        }
      } else {
        new_image = existingProduct.image;
      }

      const updatedProduct = {
        ...req.body,
        image: new_image,
      };

      await existingProduct.set(updatedProduct);
      await existingProduct.save();

      res.status(200).json({ message: "Cập nhật sản phẩm thành công" });
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Remove product from menu
  static async removeProductFromMenu(req, res) {
    try {
      const { productId, shopId } = req.body;

      const menuItem = await Menu.findOne({ product: productId, shopId });

      if (!menuItem) {
        console.log("Không tìm thấy mục menu cho ID sản phẩm:", productId);
        return res
          .status(404)
          .json({ message: "Không tìm thấy mục menu cho sản phẩm" });
      }

      const productInInventory = await Product.findOne({
        _id: productId,
        shopId,
      });
      if (!productInInventory) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tìm thấy trong kho" });
      }

      // Update the product quantity in inventory
      productInInventory.quantity += menuItem.quantity;
      productInInventory.transferredToMenu = false;
      await productInInventory.save();

      // Remove the product from the menu
      await menuItem.remove();

      res.status(200).json({ message: "Sản phẩm đã được gỡ bỏ khỏi menu" });
    } catch (error) {
      console.error("Lỗi khi gỡ sản phẩm khỏi menu", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  static async removeProductFromMenuAdmin(req, res) {
    try {
      const { productId } = req.body;

      const menuItem = await Menu.findOne({ product: productId });

      if (!menuItem) {
        console.log("Không tìm thấy mục menu cho ID sản phẩm:", productId);
        return res
          .status(404)
          .json({ message: "Không tìm thấy mục menu cho sản phẩm" });
      }

      const productInInventory = await Product.findOne({
        _id: productId,
      });
      if (!productInInventory) {
        return res
          .status(404)
          .json({ message: "Sản phẩm không tìm thấy trong kho" });
      }

      productInInventory.quantity += menuItem.quantity;
      productInInventory.transferredToMenu = false;
      await productInInventory.save();

      await menuItem.remove();

      res.status(200).json({ message: "Sản phẩm đã được gỡ bỏ khỏi menu" });
    } catch (error) {
      console.error("Lỗi khi gỡ sản phẩm khỏi menu", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  // Delete product from inventory
  static async deleteProductFromInventory(req, res) {
    const { id, shopId } = req.params;
    try {
      const productInMenu = await Menu.findOne({ _id: id, shopId });
      if (productInMenu) {
        const imgItemMenu = await Menu.findOneAndDelete({ _id: id, shopId });
        if (imgItemMenu.image != "") {
          try {
            fs.unlinkSync("./uploads/" + imgItemMenu.image);
          } catch (err) {
            console.log(err);
          }
        }
      }
      const inventoryItem = await Inventory.findOne({ product: id, shopId });
      if (inventoryItem) {
        await Inventory.findByIdAndDelete(inventoryItem._id);
      }

      const product = await Product.findOne({ _id: id, shopId });
      if (product) {
        const imgProduct = await Product.findByIdAndDelete({ _id: id, shopId });
        if (imgProduct.image != "") {
          try {
            fs.unlinkSync("./uploads/" + imgProduct.image);
          } catch (err) {
            console.log(err);
          }
        }
      }
      res.status(200).json({ message: "Sản phẩm đã xóa thành công" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
