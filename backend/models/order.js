const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderCode: {
    type: String,
    required: true,
    unique: true,
  },
  note: { type: String },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  statusId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderStatus",
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  methodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MethodDelivery",
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    default: false,
  },
  orderRequestId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderRequest",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
