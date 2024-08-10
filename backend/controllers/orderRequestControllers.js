const OrderRequest = require("../models/orderRequest");
module.exports = class orderRequestAPI {
  static async createCancelRequest(req, res) {
    try {
      const { orderId, userId, reason } = req.body;

      const newRequest = new OrderRequest({
        orderId,
        userId,
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
      const { searchTerm = "", page = 1, limit = 5 } = req.query;

      let requests = await OrderRequest.find({})
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

      const totalRequest = await OrderRequest.countDocuments();
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
        .populate("orderId")
        .populate("userId");

      if (!request) {
        return res.status(404).json({ message: "Yêu cầu không tìm thấy." });
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

      // Kiểm tra giá trị status hợp lệ
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
