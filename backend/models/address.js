const mongoose = require('mongoose');


const addressSchema = mongoose.Schema({
    paymentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Payment'},
    email: {type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false,
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

module.exports = mongoose.model('Address', addressSchema);
