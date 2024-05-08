const User = require("../models/user");
const Menu = require("../models/menu");
const Order = require("../models/order");
const moment = require('moment');
module.exports = class StatsAPI {
    static async getAllDataForStats(req, res) {
        try {
            const users = await User.countDocuments();
            const menuItems = await Menu.countDocuments();
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
            await Order.updateMany(
                { status: "Delivered" },
                [{ $set: { "month": { $month: "$createdAt" } } }]
            );
         
            res.status(200).json({
                users,
                menuItems,
                orders,
                revenue,
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
    static async fetchProductDataByMonth(req, res) {
        try {
            const { selectedYear, selectedMonth } = req.params;
    
            const orders = await Order.find({
                status: "Delivered",
                createdAt: {
                    $gte: new Date(selectedYear, selectedMonth - 1, 1),
                    $lt: new Date(selectedYear, selectedMonth, 1)
                }
            });
    
            const monthlyRevenue = {};
    
            orders.forEach(order => {
                if (order.status === "Delivered") {
                    order.products.forEach(product => {
                        const { name, quantity, price, category } = product;
                        const totalAmount = quantity * price;
                        if (category in monthlyRevenue) {
                            monthlyRevenue[category].products.push({ name, quantity, totalAmount });
                            monthlyRevenue[category].totalAmount += totalAmount; 
                        } else {
                            monthlyRevenue[category] = { products: [{ name, quantity, totalAmount }],totalAmount };
                        }
                    });
                }
            });
            res.status(200).json(monthlyRevenue);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
    

    static async fetchRevenueWithStart2End(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const startMoment = moment(startDate, 'YYYY-MM-DD');
            if (!startMoment.isValid()) {
                return res.status(400).json({ message: "Ngày bắt đầu không hợp lệ" });
            }
    
            const endMoment = moment(endDate, 'YYYY-MM-DD');
            if (!endMoment.isValid()) {
                return res.status(400).json({ message: "Ngày kết thúc không hợp lệ" });
            }
    
            const startOfDay = startMoment.startOf('day').toDate();
            const endOfDay = endMoment.endOf('day').toDate();
    
            const orders = await Order.find({
                status: "Delivered",
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });
    
            const result = {};
    
            orders.forEach(order => {
                if (order.status === "Delivered") {
                    order.products.forEach(product => {
                        const { name, quantity, price, category } = product;
                        const totalAmount = quantity * price;
                        if (category in result) {
                            const existingProductIndex = result[category].products.findIndex(p => p.name === name);
                            if (existingProductIndex !== -1) {
                                // Product exists, increase quantity
                                result[category].products[existingProductIndex].quantity += quantity;
                                result[category].products[existingProductIndex].totalAmount += totalAmount;
                            } else {
                                // Product doesn't exist, add new product
                                result[category].products.push({ name, quantity, totalAmount });
                            }
                            result[category].totalAmount += totalAmount;
                        } else {
                            result[category] = { products: [{ name, quantity, totalAmount }], totalAmount };
                        }
                    });
                }
            });
    
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    
}