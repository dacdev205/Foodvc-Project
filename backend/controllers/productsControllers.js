const fs = require("fs");
const Product = require("../models/product");

module.exports = class productAPI {
  // fetch product by id
  static async fetchProductByID(req, res) {
    const id = req.params.id;
    try {
      const product = await Product.findById(id);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateProduct(req, res) {
    const { id, shopId } = req.params;
    let new_image = "";

    try {
      const existingProduct = await Product.findOne({ _id: id, shopId });

      if (!existingProduct) {
        return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
      }

      if (req.file) {
        new_image = req.file.filename;
        // Remove the old image
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
};
