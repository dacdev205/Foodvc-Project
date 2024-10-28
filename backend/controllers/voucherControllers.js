const Voucher = require("../models/voucher");
const Payment = require("../models/payment");

function generateVoucherCode(name) {
  const prefix = "FOODVC";
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
  const now = new Date();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();
  return `${prefix}${initials}${month}${year}`;
}

module.exports = class voucherAPI {
  static async createVoucher(req, res) {
    const {
      shopId,
      name,
      quantity,
      voucher_describe,
      voucher_discount_persent,
      voucher_status,
      voucher_experied_date,
    } = req.body;

    const code = generateVoucherCode(name);

    const newVoucher = new Voucher({
      shopId: shopId,
      name: name,
      code: code,
      quantity: quantity,
      voucher_describe: voucher_describe,
      voucher_discount_persent: voucher_discount_persent,
      voucher_status: voucher_status,
      voucher_experied_date: voucher_experied_date,
    });

    try {
      const savedVoucher = await newVoucher.save();
      res.status(200).json(savedVoucher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async getAllVouchers(req, res) {
    const shopId = req.params.shopId;
    try {
      const vouchers = await Voucher.find({ shopId });
      res.status(200).json(vouchers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllSingleVouchers(req, res) {
    const id = req.params.id;
    try {
      const voucher = await Voucher.findById(id);
      res.status(200).json(voucher);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateVoucher(req, res) {
    const id = req.params.id;
    const { voucher_discount_persent, voucher_status, voucher_experied_date } =
      req.body;
    try {
      const updatedVoucher = await Voucher.findByIdAndUpdate(
        id,
        { voucher_discount_persent, voucher_status, voucher_experied_date },
        { new: true }
      );

      if (!updatedVoucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      res.json({ message: "Voucher updated successfully", updatedVoucher });
    } catch (error) {
      console.error("Error updating voucher:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteVoucher(req, res) {
    const id = req.params.id;
    try {
      await Voucher.findByIdAndDelete(id);
      res.status(200).json({ message: "Voucher deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async applyVoucherToPayment(req, res) {
    const { voucherCode, paymentId } = req.body;

    try {
      const voucher = await Voucher.findOne({ code: voucherCode });
      if (!voucher) {
        return res.status(404).json({ message: "Voucher not found" });
      }

      const now = new Date();
      if (voucher.voucher_experied_date < now) {
        return res.status(400).json({ message: "Voucher has expired" });
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      const discount =
        (payment.totalAmount * voucher.voucher_discount_persent) / 100;
      const newTotalAmount = payment.totalAmount - discount;

      res.status(200).json({
        message: "Voucher applied successfully",
        discountedAmount: Math.max(newTotalAmount, 0),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
