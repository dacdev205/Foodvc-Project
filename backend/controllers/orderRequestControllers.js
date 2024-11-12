const Order = require("../models/order");
const OrderRequest = require("../models/orderRequest");
const statusesAPI = require("./statusesControllers");
const Menu = require("../models/menu");
const { decrypt } = require("../utils/cryptoUtils");
module.exports = class orderRequestAPI {
  static async createCancelRequest(req, res) {
    try {
      const { orderId, userId, reason } = req.body;
      const order = await Order.findOne({ _id: orderId, userId }).populate(
        "shopId"
      );
      if (!order) {
        return res.status(404).json({ message: "Order không tìm thấy" });
      }
      const newRequest = new OrderRequest({
        orderId,
        userId,
        shopId: order.shopId._id,
        requestType: "Cancel",
        reason,
      });

      const savedRequest = await newRequest.save();
      res.status(201).json(savedRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra khi tạo yêu cầu." });
    }
  }
  static async getAllRequests(req, res) {
    try {
      const { searchTerm = "", page = 1, limit = 5, shopId } = req.query;

      if (!shopId) {
        return res.status(400).json({ message: "Vui lòng cung cấp shopId." });
      }

      let requests = await OrderRequest.find({ shopId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate("orderId")

        .populate("userId");

      if (searchTerm) {
        const regex = new RegExp(searchTerm, "i");
        requests = requests.filter(
          (request) => request.orderId && regex.test(request.orderId.orderCode)
        );
      }

      const totalRequest = await OrderRequest.countDocuments({ shopId });
      const totalPages = Math.ceil(totalRequest / limit);

      res.status(200).json({ requests, totalPages });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách yêu cầu." });
    }
  }

  static async getRequestById(req, res) {
    try {
      const { id } = req.params;
      const request = await OrderRequest.findById(id)
        .populate({
          path: "orderId",
          populate: { path: "addressId", select: "phone" },
        })
        .populate({
          path: "shopId",
          select: "shop_id_ghn shop_token_ghn",
        })
        .populate("userId");

      if (!request) {
        return res.status(404).json({ message: "Yêu cầu không tìm thấy." });
      }

      if (request.shopId?.shop_token_ghn) {
        request.shopId.shop_token_ghn = decrypt(request.shopId.shop_token_ghn);
      }

      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra khi lấy yêu cầu." });
    }
  }

  static async updateRequestStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["Pending", "Approved", "Rejected"].includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ." });
      }

      const updatedRequest = await OrderRequest.findByIdAndUpdate(
        id,
        { status, updatedAt: Date.now() },
        { new: true }
      );

      if (!updatedRequest) {
        return res.status(404).json({ message: "Yêu cầu không tìm thấy." });
      }

      if (status === "Approved") {
        const orderId = updatedRequest.orderId;
        const cancelledStatusId = await statusesAPI.getStatusIdByName(
          "Cancelled"
        );

        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { statusId: cancelledStatusId, updatedAt: Date.now() },
          { new: true }
        );

        if (!updatedOrder) {
          return res.status(404).json({ message: "Đơn hàng không tìm thấy." });
        }

        const products = updatedOrder.products;
        for (const product of products) {
          const { productId, quantity } = product;

          const updatedMenuItem = await Menu.findOneAndUpdate(
            { productId: productId },
            { $inc: { quantity: quantity } },
            { new: true }
          );

          if (!updatedMenuItem) {
            console.error(
              `Không thể cập nhật số lượng sản phẩm cho ID: ${productId}`
            );
            return res.status(404).json({
              message: `Không tìm thấy sản phẩm với ID: ${productId}`,
            });
          }
        }
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật yêu cầu." });
    }
  }

  static async deleteRequest(req, res) {
    try {
      const { id } = req.params;
      const deletedRequest = await OrderRequest.findByIdAndDelete(id);

      if (!deletedRequest) {
        return res.status(404).json({ message: "Yêu cầu không tìm thấy." });
      }

      res.status(200).json({ message: "Yêu cầu đã bị xóa." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Có lỗi xảy ra khi xóa yêu cầu." });
    }
  }
};
