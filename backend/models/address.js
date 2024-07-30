const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true },
  street: { type: String, required: true },
  city: {
    cityId: { type: Number, required: true },
    cityName: { type: String, required: true },
  },
  district: {
    districtId: { type: Number, required: true },
    districtName: { type: String, required: true },
  },
  ward: {
    wardCode: { type: String, required: true },
    wardName: { type: String, required: true },
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Address", addressSchema);
