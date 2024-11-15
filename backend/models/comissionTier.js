const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commissionTierSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  revenueRequired: {
    // Doanh thu yêu cầu để đạt cấp bậc
    type: Number,
    required: true,
  },
  commissionRate: {
    // Tỷ lệ hoa hồng tính trên doanh thu
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Tạo model từ schema
const CommissionTier = mongoose.model("CommissionTier", commissionTierSchema);

module.exports = CommissionTier;
