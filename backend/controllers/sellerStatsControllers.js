const User = require("../models/user");
const Menu = require("../models/menu");
const Order = require("../models/order");
const moment = require("moment");
const statusesAPI = require("./statusesControllers");
const Product = require("../models/product");
const mongoose = require("mongoose");
module.exports = class StatsAPI {
  static async getAllDataForStats(req, res) {
    try {
      const { shopId } = req.params;
      const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");

      const menuItems = await Menu.countDocuments({ shopId });
      const orders = await Order.countDocuments({ shopId });

      let revenue = 0;

      const deliveredOrders = await Order.find({
        shopId,
        statusId: CompletedStatus,
      });

      if (deliveredOrders.length > 0) {
        revenue = deliveredOrders.reduce(
          (total, order) => total + order.totalAmount,
          0
        );
      }

      await Order.updateMany({ statusId: CompletedStatus, shopId }, [
        { $set: { month: { $month: "$createdAt" } } },
      ]);

      res.status(200).json({
        menuItems,
        orders,
        revenue,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchDataByYear(req, res) {
    const { shopId } = req.params;
    const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");

    try {
      const selectedYear = req.body.year || req.params.selectedYear;

      const orders = await Order.find({
        shopId,
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

      const monthlyRevenue = await Order.aggregate([
        {
          $match: {
            shopId: mongoose.Types.ObjectId(shopId), // Ensure shopId is an ObjectId
            statusId: mongoose.Types.ObjectId(CompletedStatus), // Ensure statusId is an ObjectId
            createdAt: {
              $gte: new Date(selectedYear, 0, 1),
              $lt: new Date(parseInt(selectedYear) + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month
            totalRevenue: { $sum: "$totalAmount" }, // Sum the totalAmount field
            orderCount: { $sum: 1 }, // Count the number of orders
          },
        },
        {
          $sort: { _id: 1 }, // Sort by month in ascending order
        },
      ]);

      res.status(200).json({ monthlyRevenue, categories });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchProductDataByMonth(req, res) {
    const { shopId, selectedYear, selectedMonth } = req.params;
    const CompletedStatus = await statusesAPI.getStatusIdByName("Completed");

    try {
      const orders = await Order.find({
        shopId,
        statusId: CompletedStatus,
        createdAt: {
          $gte: new Date(selectedYear, selectedMonth - 1, 1),
          $lt: new Date(selectedYear, selectedMonth, 1),
        },
      }).populate("products.productId");

      const monthlyRevenue = {};

      for (const order of orders) {
        for (const product of order.products) {
          const productData = await Product.findById(product.productId);
          const category = productData.category || "Uncategorized";
          const totalAmount = product.quantity * productData.price;

          if (monthlyRevenue[category]) {
            monthlyRevenue[category].totalAmount += totalAmount;
            monthlyRevenue[category].products.push({
              name: productData.name,
              quantity: product.quantity,
              totalAmount,
            });
          } else {
            monthlyRevenue[category] = {
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
      const { shopId } = req.params;
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
        shopId,
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
