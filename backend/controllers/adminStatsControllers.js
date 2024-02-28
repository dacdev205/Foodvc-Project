const User = require("../models/user");
const Menu = require("../models/menu");
const Payment = require("../models/payment");
const Order = require("../models/order");
const fs = require("fs");

module.exports = class StatsAPI {
    static async getAllDataForStats(req, res) {
        try {
            const users = await User.countDocuments();
            const menuItems = await Menu.countDocuments();
            const payments = await Payment.countDocuments();
            const orders = await Order.countDocuments();
            let revenue = 0;
            const deliveredOrders = await Order.find({ status: "Delivered" });
            if (deliveredOrders.length > 0) {
                const result = await Order.aggregate([
                    { $match: { status: "Delivered" } }, 
                    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
                ]);
                revenue = result.length > 0 ? result[0].totalRevenue : 0;
            }
    
            res.status(200).json({
                users,
                menuItems,
                payments,
                orders,
                revenue 
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }    
}
