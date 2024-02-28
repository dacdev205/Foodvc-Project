const mongoose = require('mongoose');
// 
const orderSchema = mongoose.Schema({
    userId: { type:String, required: true},
    email: {
        type: String,
        required: true,
    },
    orderCode: {
        type: String,
        required: true,
        unique: true 
    },
    address:{
        street: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true },
        ward: { type: String, required: true },
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'In Transit', 'Delivered'],
        default: 'Pending',
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    products: [{
        name: String,
        category: String,
        recipe: String,
        image: String,
        quantity: Number,
        price: String,
        productionLocation: String,
        instructions: String,
        expirationDate: Date,
        storage: {
            temperature: Number,
            unit: String
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Order', orderSchema);
