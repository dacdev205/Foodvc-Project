const mongoose = require("mongoose");
const Order = require("../models/order");
const OrderStatus = require("../models/orderStatus");
const User = require("../models/user");

const checkCancelCount = async (req, res, next) => {
  try {
    const email = req.decoded.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cancelledStatus = await OrderStatus.findOne({ name: "Cancelled" });
    if (!cancelledStatus) {
      return res.status(500).json({
        message:
          "Không tìm thấy trạng thái 'Cancelled'. Vui lòng liên hệ hỗ trợ.",
      });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const cancelledOrdersCount = await Order.countDocuments({
      userId: mongoose.Types.ObjectId(user._id),
      statusId: cancelledStatus._id,
      updatedAt: { $gte: sixMonthsAgo },
    });

    if (cancelledOrdersCount === 1) {
      req.showWarning = true;
      req.warningMessage =
        "Bạn đã hủy 2 đơn hàng trong vòng 6 tháng qua. Vui lòng cẩn thận, nếu hủy thêm 1 đơn nữa bạn sẽ bị hạn chế quyền tạo đơn hàng mới.";
    }
    if (cancelledOrdersCount === 2) {
      req.showWarning = true;
      req.warningMessage =
        "Bạn đã hủy 3 đơn hàng trong vòng 6 tháng qua. Chúng tôi sẽ hạn chế quyền tạo đơn hàng mới của ban.";
    }
    if (cancelledOrdersCount >= 3) {
      return res.status(403).json({
        message:
          "Bạn đã hủy quá nhiều đơn hàng trong vòng 6 tháng và không thể tạo đơn hàng mới. Vui lòng liên hệ hỗ trợ.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkCancelCount middleware:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = checkCancelCount;
