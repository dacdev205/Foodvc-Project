const Payment = require("../models/payment");
const { decrypt } = require("../utils/cryptoUtils");
module.exports = class PaymentAPI {
  static async createPayment(req, res) {
    const { userId, products, totalAmount } = req.body;

    try {
      let payment = await Payment.findOne({ userId: userId });
      if (!payment) {
        payment = await Payment.create({
          userId,
          products,
          totalAmount,
        });
        return res
          .status(201)
          .json({ message: "Trang thanh toán được tạo thành công" });
      }

      payment.products = products;
      payment.totalAmount = totalAmount;
      await payment.save();

      res
        .status(200)
        .json({ message: "Trang thanh toán được cập nhật thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async fetchAllPaymentWithUserId(req, res) {
    try {
      const userId = req.query.userId;
      const payments = await Payment.find({ userId }).populate(
        "products.productId"
      );

      if (payments.length > 0) {
        res.status(200).json(payments);
      } else {
        res.status(404).json({ message: "Trang thanh toán không tìm thấy" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateProductInPayment(req, res) {
    const paymentId = req.params.paymentId;
    const { productId, quantity } = req.body;

    try {
      const payment = await Payment.findOneAndUpdate(
        { _id: paymentId, "products.productId": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );

      if (payment) {
        res.status(200).json({ message: "Cập nhật số lượng thành công" });
      } else {
        res
          .status(404)
          .json({ message: "Trang thanh toán hoặc sản phẩm không tìm thấy" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async fetchPaymentByUserID(req, res) {
    const userId = req.params.userId;
    try {
      const payments = await Payment.find({ userId: userId })
        .populate("products.productId")
        .populate({
          path: "products.shopId",
          select: "shop_token_ghn shop_id_ghn addresses",
          populate: {
            path: "addresses",
            select: "street city district ward phone",
          },
        });

      if (payments.length > 0) {
        payments.forEach((payment) => {
          payment.products.forEach((product) => {
            if (product.shopId?.shop_token_ghn) {
              product.shopId.shop_token_ghn = decrypt(
                product.shopId.shop_token_ghn
              );
            }
          });
        });

        return res.status(200).json(payments);
      }
      return res
        .status(404)
        .json({ message: "Người dùng không có trang thanh toán nào" });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
};
