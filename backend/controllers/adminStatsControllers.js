const User = require("../models/user");
const Menu = require("../models/menu");
const Order = require("../models/order");
const moment = require("moment");
const statusesAPI = require("../controllers/statusesControllers");
const Product = require("../models/product");
const mongoose = require("mongoose");

const Shop = require("../models/shop");
module.exports = class StatsAPI {
  static async getAllDataForStats(req, res) {
    try {
      const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");
      const users = await User.countDocuments();
      const menuItems = await Menu.countDocuments();
      const orders = await Order.countDocuments();
      const shops = await Shop.countDocuments();
      let revenue = 0;
      const deliveredOrders = await Order.find({
        statusId: CompletedStatus,
      });

      if (deliveredOrders.length > 0) {
        const result = await Order.aggregate([
          { $match: { statusId: CompletedStatus } },
          { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
        ]);
        revenue = result.length > 0 ? result[0].totalRevenue : 0;
      }

      await Order.updateMany({ statusId: CompletedStatus }, [
        { $set: { month: { $month: "$createdAt" } } },
      ]);

      res.status(200).json({
        users,
        menuItems,
        orders,
        shops,
        revenue,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchDataByYear(req, res) {
    const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");

    try {
      const selectedYear = req.body.year || req.params.selectedYear;

      const orders = await Order.find({
        statusId: CompletedStatus,
        createdAt: {
          $gte: new Date(selectedYear, 0, 1),
          $lt: new Date(parseInt(selectedYear) + 1, 0, 1),
        },
      }).populate("products.productId");

      const categories = {};

      for (const order of orders) {
        for (const product of order.products) {
          const productData = await Product.findById(product.productId);
          if (!productData) continue;

          const category = productData.category || "Uncategorized";
          const totalAmount = product.quantity * productData.price;

          if (categories[category]) {
            categories[category].totalAmount += totalAmount;
            categories[category].orders.push(order._id);
          } else {
            categories[category] = {
              totalAmount,
              orders: [order._id],
            };
          }
        }
      }

      // Fetch monthly revenue without shopId filter
      const monthlyRevenue = await Order.aggregate([
        {
          $match: {
            statusId: mongoose.Types.ObjectId(CompletedStatus),
            createdAt: {
              $gte: new Date(selectedYear, 0, 1),
              $lt: new Date(parseInt(selectedYear) + 1, 0, 1),
            },
          },
        },
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalRevenue: {
              $sum: { $multiply: ["$products.quantity", "$totalAmount"] },
            },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.status(200).json({ monthlyRevenue, categories });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchProductDataByMonth(req, res) {
    const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");
    try {
      const { selectedYear, selectedMonth } = req.params;

      const orders = await Order.find({
        statusId: CompletedStatus,
        createdAt: {
          $gte: new Date(selectedYear, selectedMonth - 1, 1),
          $lt: new Date(selectedYear, selectedMonth, 1),
        },
      }).populate("products.productId");

      const monthlyRevenue = {};

      for (const order of orders) {
        for (const product of order.products) {
          const productData = await Product.findById(
            product.productId
          ).populate("category");

          const categoryName = productData.category
            ? productData.category.name
            : "Uncategorized";
          const totalAmount = product.quantity * productData.price;

          if (monthlyRevenue[categoryName]) {
            monthlyRevenue[categoryName].totalAmount += totalAmount;
            monthlyRevenue[categoryName].products.push({
              name: productData.name,
              quantity: product.quantity,
              totalAmount,
            });
          } else {
            monthlyRevenue[categoryName] = {
              products: [
                {
                  name: productData.name,
                  quantity: product.quantity,
                  totalAmount,
                },
              ],
              totalAmount,
            };
          }
        }
      }

      res.status(200).json(monthlyRevenue);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchRevenueWithStart2End(req, res) {
    try {
      const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");
      const { startDate, endDate } = req.query;

      const startMoment = moment(startDate, "YYYY-MM-DD", true);
      const endMoment = moment(endDate, "YYYY-MM-DD", true);

      if (!startMoment.isValid()) {
        return res.status(400).json({ message: "Ngày bắt đầu không hợp lệ" });
      }
      if (!endMoment.isValid()) {
        return res.status(400).json({ message: "Ngày kết thúc không hợp lệ" });
      }

      const startOfDay = startMoment.startOf("day").toDate();
      const endOfDay = endMoment.endOf("day").toDate();
      const orders = await Order.find({
        statusId: CompletedStatus,
        createdAt: { $gte: startOfDay, $lte: endOfDay },
      }).populate("products.productId", "name price category");

      const result = {};

      orders.forEach((order) => {
        order.products.forEach((product) => {
          const { productId, quantity } = product;
          const { name, price, category } = productId;
          const totalAmount = quantity * price;

          if (!result[category]) {
            result[category] = {
              products: [],
              totalAmount: 0,
            };
          }

          const existingProductIndex = result[category].products.findIndex(
            (p) => p.name === name
          );

          if (existingProductIndex !== -1) {
            result[category].products[existingProductIndex].quantity +=
              quantity;
            result[category].products[existingProductIndex].totalAmount +=
              totalAmount;
          } else {
            result[category].products.push({ name, quantity, totalAmount });
          }

          result[category].totalAmount += totalAmount;
        });
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};
