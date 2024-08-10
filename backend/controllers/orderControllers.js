const Menu = require("../models/menu");
const Order = require("../models/order");
const statusesAPI = require("../controllers/statusesControllers");

module.exports = class orderAPI {
  static async createOrder(req, res) {
    const { userId, orderCode, products, totalAmount, addressId, note } =
      req.body;
    const pendingStatusId = await statusesAPI.getStatusIdByName("Pending");
    try {
      const order = await Order.create({
        userId,
        orderCode,
        products,
        totalAmount,
        statusId: pendingStatusId,
        addressId,
        note,
      });

      for (const product of products) {
        const foundProduct = await Menu.findOne({ _id: product.productId });
        if (foundProduct) {
          foundProduct.quantity -= product.quantity;
          await foundProduct.save();
        }
      }

      return res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getUserOrders(req, res) {
    const userId = req.params.userId;
    const {
      searchTerm = "",
      filterType = "orderCode",
      page = 1,
      limit = 5,
    } = req.query;

    const query = { userId };
    try {
      if (searchTerm) {
        if (filterType === "orderCode") {
          query.orderCode = { $regex: searchTerm, $options: "i" };
        }
      }
      const orders = await Order.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("statusId")
        .populate("products.productId");

      const totalOrders = await Order.countDocuments(query);
      const totalPages = Math.ceil(totalOrders / limit);

      res.status(200).json({
        orders,
        totalPages,
      });
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async fetchAllOrder(req, res) {
    try {
      const {
        searchTerm = "",
        searchStatus = "",
        page = 1,
        limit = 5,
      } = req.query;

      const filter = {};

      if (searchTerm) {
        filter.orderCode = { $regex: searchTerm, $options: "i" };
      }
      if (searchStatus) {
        filter.statusId = searchStatus;
      }

      const orders = await Order.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("statusId")
        .populate("products.productId");
      const totalOrders = await Order.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / limit);
      res.status(200).json({ orders, totalPages });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getOrderById(req, res) {
    const id = req.params.id;
    try {
      const order = await Order.findById(id).populate("statusId");
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async updateOrderStatus(req, res) {
    const orderId = req.params.id;
    const { statusId } = req.body;

    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { statusId },
        { new: true }
      ).populate("statusId");

      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async reportRevenueToday(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const orders = await Order.find({
        createdAt: { $gte: today, $lt: tomorrow },
      }).populate("statusId");
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};
