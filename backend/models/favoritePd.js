const mongoose = require("mongoose");
const favoriteSchema = mongoose.Schema({
  email: String,
  name: String,
  category: String,
  recipe: String,
  image: String,
  quantity: Number,
  price: String,
  created: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model("WishList", favoriteSchema)