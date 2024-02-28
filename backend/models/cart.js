const mongoose = require("mongoose");
const cartSchema = mongoose.Schema({
  email: String,
  name: String,
  category: String,
  recipe: String,
  image: String,
  quantity: Number,
  price: String,
  brand: String, 
  productionLocation: String, 
  instructions: String, 
  expirationDate: {
    type: Date,
    default: function() {
      const now = new Date();
      now.setDate(now.getDate() + 4);
      return now;
    }
  },
  storage: {
    temperature: {
      type: Number,
      min: -273.15, 
      max: 4,        
      default: 4    
    },
    unit: {
      type: String,
      enum: ["Celsius", "Fahrenheit"],
      default: "Celsius"
    }
  },
  created: {
    type: Date,
    default: Date.now()
  },
});

module.exports = mongoose.model("Cart", cartSchema)