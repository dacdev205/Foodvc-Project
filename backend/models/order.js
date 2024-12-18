const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
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
  totalProductAmount: {
    // Tổng tiền hàng
    type: Number,
    required: true,
  },
  shippingFee: {
    // Phí vận chuyển
    type: Number,
    required: true,
  },
  totalAmount: {
    // Tổng giá trị đơn hàng (tổng tiền hàng + phí vận chuyển)
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
      shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
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
  expected_delivery_time: { type: Date, required: true },
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
