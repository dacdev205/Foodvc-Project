const Menu = require("../models/menu");
const Order = require("../models/order");
const statusesAPI = require("../controllers/statusesControllers");
const OrderStatus = require("../models/orderStatus");
const User = require("../models/user");
const OrderRequest = require("../models/orderRequest");
const methodDeliAPI = require("./methodDeliControllers");
module.exports = class orderAPI {
  static async createOrder(req, res) {
    const {
      userId,
      orderCode,
      products,
      totalAmount,
      addressId,
      orderRequestId,
      note,
      methodId,
    } = req.body;
    const pendingStatusId = await statusesAPI.getStatusIdByName("Pending");
    const waiting4PickupStatusId = await statusesAPI.getStatusIdByName(
      "Waiting4Pickup"
    );
    const methodDoc = await methodDeliAPI.getMethodIdByMethodId(methodId);
    let statusId;
    let paymentStatus = false;
    if (methodDoc.methodId === 2) {
      statusId = waiting4PickupStatusId;
      paymentStatus = true;
    } else {
      statusId = pendingStatusId;
    }
    try {
      const order = await Order.create({
        userId,
        orderCode,
        products,
        orderRequestId,
        totalAmount,
        statusId,
        addressId,
        note,
        methodId,
        paymentStatus,
      });

      for (const product of products) {
        const foundProduct = await Menu.findOne({
          productId: product.productId,
        });
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
  static async cancelOrder(req, res) {
    try {
      const { orderId, reason } = req.body;
      const email = req.decoded.email;
      const user = await User.findOne({ email });
      const userId = user._id;

      const order = await Order.findOne({ _id: orderId, userId });
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const cancelledStatus = await OrderStatus.findOne({ name: "Cancelled" });
      if (!cancelledStatus) {
        return res.status(500).json({
          message:
            "Không tìm thấy trạng thái 'Cancelled'. Vui lòng liên hệ hỗ trợ.",
        });
      }

      order.statusId = cancelledStatus._id;
      order.updatedAt = new Date();

      await order.save();

      const newRequest = new OrderRequest({
        orderId,
        userId,
        requestType: "Cancel",
        reason,
        status: "Approved",
      });

      await newRequest.save();

      return res.status(200).json({
        message: "Đơn hàng đã được hủy thành công.",
        showWarning: req.showWarning || false,
        warningMessage: req.warningMessage || null,
        order,
        request: newRequest,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Lỗi khi hủy đơn hàng. Vui lòng thử lại sau.",
      });
    }
  }

  static async addOrderReq(req, res) {
    try {
      const { orderRequestId } = req.body;
      const order = await Order.findByIdAndUpdate(
        req.params.orderId,
        { $push: { orderRequestId } },
        { new: true }
      );
      res.json(order);
    } catch (error) {
      res.status(500).send("Có lỗi xảy ra khi cập nhật đơn hàng.");
    }
  }
  static async getUserOrders(req, res) {
    const userId = req.params.userId;
    const {
      searchTerm = "",
      filterType = "orderCode",
      page = 1,
      limit = 2,
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
        .limit(Number(limit))
        .populate("statusId")
        .populate("products.productId")
        .populate("orderRequestId");

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
      const order = await Order.findById(id)
        .populate("userId")
        .populate("statusId")
        .populate("products.productId")
        .populate("addressId");
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
