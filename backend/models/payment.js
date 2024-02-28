const mongoose = require('mongoose');
// 
const paymentSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    products: [
        {
            type: {
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
                expirationDate: Date,
                storage: {
                    temperature: Number,
                    unit: String
                },
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
});

module.exports = mongoose.model('Payment', paymentSchema);
