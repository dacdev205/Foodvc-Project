const Transaction = require("../models/transactions");
const Order = require("../models/order");
module.exports = class TransactionAPI {
  static async createTransaction(req, res) {
    const {
      amount,
      bankCode,
      bankTranNo,
      cardType,
      orderInfo,
      payDate,
      responseCode,
      transactionNo,
      transactionStatus,
      txnRef,
      tmnCode,
      secureHash,
      userId,
      orderCode,
      shopId,
    } = req.body;
    try {
      const transaction = new Transaction({
        amount,
        bankCode,
        bankTranNo,
        cardType,
        orderInfo,
        payDate,
        responseCode,
        orderCode,
        transactionNo,
        transactionStatus,
        txnRef,
        tmnCode,
        secureHash,
        userId,
        shopId,
      });

      await transaction.save();

      res
        .status(201)
        .json({ message: "Đã lưu giao dịch thành công", transaction });
    } catch (error) {
      res.status(500).json({ message: "Lỗi lưu giao dịch", error });
    }
  }
  static async getTransactionsByShop(req, res) {
    try {
      const {
        shopId,
        transactionNo,
        payDate,
        searchTerm,
        page = 1,
        pageSize = 10,
      } = req.query;

      let query = { shopId };

      if (transactionNo) {
        query.transactionNo = transactionNo;
      }

      if (payDate) {
        query.payDate = payDate;
      }

      if (searchTerm) {
        query.$or = [
          { transactionNo: { $regex: searchTerm, $options: "i" } },
          { orderCode: { $regex: searchTerm, $options: "i" } },
        ];
      }

      const pageNumber = parseInt(page, 10);
      const pageSizeNumber = parseInt(pageSize, 10);

      const skip = (pageNumber - 1) * pageSizeNumber;
      const limit = pageSizeNumber;

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const totalTransactions = await Transaction.countDocuments(query).exec();
      const totalPages = Math.ceil(totalTransactions / pageSizeNumber);
      return res.status(200).json({
        transactions,
        totalPages,
        currentPage: pageNumber,
        totalTransactions,
      });
    } catch (error) {
      console.error("Lỗi nhận giao dịch", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  static async getTransactionsByAdmin(req, res) {
    try {
      const {
        transactionNo,
        payDate,
        searchTerm,
        page = 1,
        pageSize = 10,
      } = req.query;

      let query = {};

      if (transactionNo) {
        query.transactionNo = transactionNo;
      }

      if (payDate) {
        query.payDate = payDate;
      }

      if (searchTerm) {
        query.$or = [
          { transactionNo: { $regex: searchTerm, $options: "i" } },
          { orderCode: { $regex: searchTerm, $options: "i" } },
        ];
      }

      const pageNumber = parseInt(page, 10);
      const pageSizeNumber = parseInt(pageSize, 10);

      const skip = (pageNumber - 1) * pageSizeNumber;
      const limit = pageSizeNumber;

      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();

      const totalTransactions = await Transaction.countDocuments(query).exec();
      const totalPages = Math.ceil(totalTransactions / pageSizeNumber);

      return res.status(200).json({
        transactions,
        totalPages,
        currentPage: pageNumber,
        totalTransactions,
      });
    } catch (error) {
      console.error("Lỗi nhận giao dịch", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
  static async checkOrderStatus(req, res) {
    const { orderCode } = req.params;

    try {
      const order = await Order.findOne({ orderCode }).populate("statusId");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const isCompleted = order.statusId && order.statusId.name === "Completed";

      if (isCompleted) {
        return res.status(200).json({ message: "Order is completed", order });
      } else {
        return res
          .status(200)
          .json({ message: "Order is not completed", order });
      }
    } catch (error) {
      console.error("Error checking order status", error);
      return res.status(500).json({ message: "Server error", error });
    }
  }
};
