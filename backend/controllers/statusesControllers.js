const OrderStatus = require("../models/orderStatus");
module.exports = class statusesAPI {
  static async gettAllStatuses(req, res) {
    try {
      const statuses = await OrderStatus.find({});
      res.status(200).json(statuses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async initializeOrderStatuses(req, res, next) {
    const statuses = [
      { name: "Pending", description: "Chờ xử lý" },
      { name: "Waiting4Pickup", description: "Chờ lấy hàng" },
      { name: "InTransit", description: "Đang vận chuyển" },
      { name: "Delivery", description: "Đang giao hàng" },
      { name: "Completed", description: "Đã hoàn thành" },
      { name: "Cancelled", description: "Đã hủy" },
      { name: "ReturnedRefunded", description: "Đã hoàn trả hoặc hoàn tiền" },
    ];

    try {
      for (const status of statuses) {
        await OrderStatus.updateOne(
          { name: status.name },
          { $set: status },
          { upsert: true }
        );
      }
    } catch (err) {
      console.error("Lỗi khởi tạo trạng thái đơn hàng", err);
    }
  }

  static async getStatusIdByName(statusName) {
    try {
      const status = await OrderStatus.findOne({ name: statusName });
      if (status) {
        return status._id;
      } else {
        throw new Error("Status không tìm thấy");
      }
    } catch (err) {
      throw new Error("Lỗi truy xuất ID Status: " + err.message);
    }
  }
};
