const Voucher = require("../models/voucher");

module.exports = class voucherAPI {
  static async createVoucher(req, res) {
    const {
      name,
      voucher_describe,
      voucher_discount_persent,
      voucher_status,
      voucher_experied_date,
    } = req.body;
    const newVoucher = new Voucher({
      name: name,
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
    try {
      const vouchers = await Voucher.find({});
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
};
