const Payment = require('../models/payment');
const fs = require("fs");
const Cart = require('../models/cart');

module.exports = class PaymentAPI {
    static async createPayment(req, res) {
        const { email, products } = req.body;
        
        try {
            const payment = await Payment.findOne({ email: email });
            if (!payment) {
                payment = await Payment.create({
                    email: email,
                    products: products,
                });
                return res.status(201).json({ message: 'Payment created succesfully'});
            }
    
            payment.products = products;
    
            await payment.save();
    
            res.status(200).json({ message: 'Update order succesfully'});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
     //fetch all product
     static async fetchAllPaymentWithEmail(req, res) {
        try {
            const email = req.query.email;
            const payments = await Payment.find({email: email});
            if(payments) {
                res.status(200).json(payments);
            } else {
                res.status(404).json({message: 'Product not found'})
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

     //update product by id
     static async updateProductInPayment(req, res) {
        const productId = req.params.productId;
        const { quantity } = req.body;

        try {
            await Payment.findOneAndUpdate(
                { "products._id": productId },
                { $set: { "products.$.quantity": quantity } }
            );

            res.status(200).json({ message: 'Quantity updated successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    static async fetchPaymentByID(req, res) {
        const id = req.params.id;
        try {
            const product = await Payment.findById(id);
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
};
