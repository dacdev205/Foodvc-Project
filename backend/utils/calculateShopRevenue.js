const Order = require("../models/order");
const CommissionTier = require("../models/comissionTier");
const Shop = require("../models/shop");

// Kiểm tra trạng thái hoàn thành của đơn hàng
async function isOrderCompleted(orderId) {
  try {
    const order = await Order.findById(orderId).populate("statusId");

    if (order && order.statusId) {
      return order.statusId.name === "Completed";
    }

    return false;
  } catch (error) {
    console.error("Error checking order completion status:", error);
    throw error;
  }
}

// Tính doanh thu của cửa hàng
async function calculateShopRevenue(shopId) {
  try {
    const orders = await Order.find({ shopId: shopId });
    let totalRevenue = 0;

    for (const order of orders) {
      const isCompleted = await isOrderCompleted(order._id);
      if (isCompleted) {
        totalRevenue += order.totalAmount;
      }
    }

    return totalRevenue;
  } catch (error) {
    console.error("Error calculating shop revenue:", error);
    throw error;
  }
}

// Tính hoa hồng và tổng hoa hồng phải trả cho cửa hàng
async function getShopCommission(shopId) {
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      throw new Error("Cửa hàng không tồn tại.");
    }

    const shopRevenue = await calculateShopRevenue(shop._id);
    let commissionTier;
    if (shopRevenue >= 20000000) {
      commissionTier = await CommissionTier.findOne({ name: "Bạch kim" });
    } else if (shopRevenue >= 15000000) {
      commissionTier = await CommissionTier.findOne({ name: "Vàng" });
    } else if (shopRevenue >= 5000000) {
      commissionTier = await CommissionTier.findOne({ name: "Bạc" });
    } else {
      commissionTier = await CommissionTier.findOne({ name: "Bán lẻ" });
    }

    if (!commissionTier) {
      throw new Error("Không tìm thấy chính sách hoa hồng.");
    }

    const orders = await Order.find({
      shopId: shop._id,
      paymentStatus: false,
      methodId: "66b8dd7ceaf199f36610a363",
    }).populate("statusId");
    const completedOrders = orders.filter(
      (order) => order.statusId.name === "Completed"
    );

    let totalCommissionAmount = 0;
    const orderCommissions = [];

    for (const order of completedOrders) {
      const orderCommissionAmount = (
        (commissionTier.commissionRate / 100) *
        order.totalAmount
      ).toFixed(2);
      totalCommissionAmount += parseFloat(orderCommissionAmount);
      orderCommissions.push({
        orderId: order._id,
        orderCode: order.orderCode,
        orderAmount: order.totalAmount,
        commissionAmount: parseFloat(orderCommissionAmount),
      });
    }

    return {
      shopId: shop._id,
      commissionTier: commissionTier,
      shopName: shop.name,
      orderCommissions: orderCommissions,
      totalCommissionAmount: parseFloat(totalCommissionAmount.toFixed(2)),
      shopRevenue,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy thông tin hoa hồng: " + error.message);
  }
}

module.exports = { isOrderCompleted, calculateShopRevenue, getShopCommission };
