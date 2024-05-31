const mongoose = require("mongoose");
const voucherSchema = mongoose.Schema({
  name: {
    type: String,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  voucher_describe: {
    type: String,
  },
  voucher_discount_persent: {
    type: Number,
  },
  voucher_status: {
    type: Boolean,
    default: false,
  },
  voucher_experied_date: {
    type: Date,
    default: function () {
      const now = new Date();
      now.setDate(now.getDate() + 30);
      return now;
    },
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// create a model instance
module.exports = mongoose.model("Voucher", voucherSchema);
