const mongoose = require('mongoose')
// 
const reviewSchema  = mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    userId: { type: String,required: true},
    rating: { type: Number, required: true },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    userName: { type: String}
    
  }
)
// create a model instance
module.exports = mongoose.model("Review", reviewSchema )
