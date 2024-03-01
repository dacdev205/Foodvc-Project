const User = require("../models/user");
const Menu = require("../models/menu");
const Order = require("../models/order");

module.exports = class StatsAPI {
    static async getAllDataForStats(req, res) {
        try {
            const users = await User.countDocuments();
            const menuItems = await Menu.countDocuments();
            const orders = await Order.countDocuments();
            // const oldestOrder = await Order.findOne({}, {}, { sort: { 'createdAt': 1 } });
            // const newestOrder = await Order.findOne({}, {}, { sort: { 'createdAt': -1 } });
           
            let revenue = 0;
            const deliveredOrders = await Order.find({ status: "Delivered" });
            if (deliveredOrders.length > 0) {
                const result = await Order.aggregate([
                    { $match: { status: "Delivered" } }, 
                    { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
                ]);
                revenue = result.length > 0 ? result[0].totalRevenue : 0;
            }
            await Order.updateMany(
                { status: "Delivered" },
                [{ $set: { "month": { $month: "$createdAt" } } }]
            );
            const monthlyRevenue = await Order.aggregate([
                {
                    $match: { status: "Delivered" }
                },
                {
                    $group: {
                        _id: "$month",
                        totalAmount: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
            // const oldestMonth = oldestOrder ? new Date(oldestOrder.createdAt).toLocaleDateString("vi-VN", { month: "short" }) : '';
            // const newestMonth = newestOrder ? new Date(newestOrder.createdAt).toLocaleDateString("vi-VN", { month: "short" }) : '';
            const categories = await Order.distinct('products.category', { status: 'Delivered' });
            res.status(200).json({
                users,
                menuItems,
                orders,
                revenue,
                monthlyRevenue,
                // oldestMonth,
                // newestMonth,
                categories
            }); 

        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    static async fetchDataByYear(req, res) {
        try {
            const selectedYear = req.body.year || req.params.selectedYear;
    
            // Fetch categories
            const categories = await Order.distinct('products.category', { 
                status: 'Delivered',
                createdAt: { 
                    $gte: new Date(selectedYear, 0, 1), 
                    $lt: new Date(parseInt(selectedYear) + 1, 0, 1) 
                }
            });
    
            // Update orders with month information
            await Order.updateMany(
                { 
                    status: "Delivered",
                    createdAt: { 
                        $gte: new Date(selectedYear, 0, 1), 
                        $lt: new Date(parseInt(selectedYear) + 1, 0, 1) 
                    }
                },
                [{ $set: { "month": { $month: "$createdAt" } } }]
            );
    
            // Fetch monthly revenue
            const monthlyRevenue = await Order.aggregate([
                {
                    $match: { 
                        status: "Delivered", 
                        createdAt: { 
                            $gte: new Date(selectedYear, 0, 1), 
                            $lt: new Date(parseInt(selectedYear) + 1, 0, 1) 
                        } 
                    }
                },
                {
                    $group: {
                        _id: "$month",
                        totalAmount: { $sum: "$totalAmount" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);
    
            res.status(200).json({ monthlyRevenue, categories });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
}
