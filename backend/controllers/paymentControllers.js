const Payment = require("../models/payment");

module.exports = class PaymentAPI {
  static async createPayment(req, res) {
    const { userId, products } = req.body;

    try {
      let payment = await Payment.findOne({ userId: userId });
      if (!payment) {
        payment = await Payment.create({
          userId,
          products,
        });
        return res
          .status(201)
          .json({ message: "Payment created successfully" });
      }

      payment.products = products;
      await payment.save();

      res.status(200).json({ message: "Payment updated successfully" });
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
        res.status(404).json({ message: "Payments not found" });
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
        res.status(200).json({ message: "Quantity updated successfully" });
      } else {
        res.status(404).json({ message: "Payment or product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async fetchPaymentByUserID(req, res) {
    const userId = req.params.userId;
    try {
      const payments = await Payment.find({ userId: userId }).populate(
        "products.productId"
      );

      if (payments.length > 0) {
        res.status(200).json(payments);
      } else {
        res.status(404).json({ message: "No payments found for this user" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
