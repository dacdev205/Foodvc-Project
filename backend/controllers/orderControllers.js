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
    try {
      const orders = await Order.find({ userId }).populate("statusId");
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: error.message });
    }
  }

  static async fetchAllOrderWithEmail(req, res) {
    try {
      const email = req.query.email;
      const orders = await Order.find({ email })
        .populate("statusId")
        .populate("products.productId");
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async fetchAllOrder(req, res) {
    try {
      const orders = await Order.find().populate("statusId");
      res.status(200).json(orders);
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
