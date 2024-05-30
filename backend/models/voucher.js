const mongoose = require("mongoose");
const voucherSchema = mongoose.Schema({
  name: {
    type: String,
  },
  voucher_describe: {
    type: String,
  },
  voucher_discount_persent: {
    type: Number,
  },
  voucher_status: {
    type: Boolean,
    default: true,
  },
  voucher_experied_date: {
    type: Date,
    default: function () {
      const now = new Date();
      now.setDate(now.getDate() + 30);
      return now;
    },
  },
});

// create a model instance
module.exports = mongoose.model("Voucher", voucherSchema);
