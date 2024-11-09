const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionNo: {
      type: String,
      required: true,
      unique: true,
    },
    refund: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      required: true,
    },
    orderInfo: {
      type: String,
      required: true,
    },
    payDate: {
      type: String,
      required: true,
    },
    responseCode: {
      type: String,
      required: true,
    },
    transactionStatus: {
      type: String,
      required: true,
    },
    txnRef: {
      type: String,
      required: true,
    },
    secureHash: {
      type: String,
      required: true,
    },
    orderCode: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
