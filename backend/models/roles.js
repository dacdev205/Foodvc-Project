const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: String,
  permissions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Role", roleSchema);
