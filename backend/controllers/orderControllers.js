const Cart = require('../models/cart');
const Menu = require('../models/menu');
const Order = require('../models/order');
const fs = require("fs");

module.exports = class orderAPI {
    static async createOrder(req, res) {
        const {userId, email , products, totalAmount, orderCode, address } = req.body;
        
        try {
            const orders = await Order.create({
                userId,
                email,
                products,
                totalAmount,
                orderCode,
                address
            });
            for (const product of products) {
                const foundProduct = await Menu.findOne({ _id: product._id });
                if (foundProduct) {
                    foundProduct.quantity -= product.quantity;
                    await foundProduct.save();
                }
            }
            for (const product of products) {
                await Cart.findOneAndDelete({ _id: product._id });
            }
                return res.status(201).json(orders);
            
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
    }
    static async getUserOrders(req, res) {
        const userId = req.params.userId; 
        try {
            const orders = await Order.find({userId: userId});
            return res.status(201).json(orders);
        } catch (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }
    };
     //fetch all product
     static async fetchAllOrderWithEmail(req, res) {
        try {
            const email = req.query.email;
            const orders = await Order.find({email: email});
            if(orders) {
                res.status(200).json(orders);
            } else {
                res.status(404).json({message: 'Order not found'})
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
    static async fetchAllOrder(req, res) {
      try {
          const orders = await Order.find();
          res.status(200).json(orders);
      } catch (err) {
          res.status(500).json({message: err.message});
      }
  }
    static async getOrderById(req, res) {
      const id = req.params.id; 
      try {
          const orders = await Order.findById(id);
          return res.status(201).json(orders);
      } catch (error) {
          console.error('Error fetching user orders:', error);
          throw error;
      }
    };
    // Update order status by ID
  static async updateOrderStatus(req, res) {
    const orderId = req.params.id;
    const { status } = req.body;

    try {
      const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
