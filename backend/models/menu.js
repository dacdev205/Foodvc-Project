const mongoose = require("mongoose");
// 
const menuSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 3
  },
  recipe: String,
  image: String,
  brand: String,  
  category: String,
  price: Number,
  quantity: Number,
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
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Menu", menuSchema);