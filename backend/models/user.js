// user.js
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    trim: true,
    minlength: 3,
  },
  photoURL: {
    type: String,
  },
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  isSeller: { type: Boolean, default: false },
  shops: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shop" }],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  points: {
    type: Number,
    default: 0,
  },
  rank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRank",
    default: null,
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

// Thêm phương thức checkAndUpgradeRank vào schema
userSchema.methods.checkAndUpgradeRank = async function () {
  const UserRank = mongoose.model("UserRank");

  const ranks = await UserRank.find().sort({ user_rank_point: 1 });

  for (let i = ranks.length - 1; i >= 0; i--) {
    if (this.points >= ranks[i].user_rank_point) {
      if (!this.rank || this.rank.toString() !== ranks[i]._id.toString()) {
        this.rank = ranks[i]._id;
        await this.save();
      }
      break;
    }
  }
};

module.exports = mongoose.model("User", userSchema);
