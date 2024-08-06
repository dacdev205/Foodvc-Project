const mongoose = require("mongoose");
const Role = require("../models/roles");

async function initializeRoles() {
  mongoose.connect(
    "mongodb+srv://congdat147x:0962034466a@cluster0.dqeuvj7.mongodb.net/Foodvc",
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const adminRole = new Role({
    name: "admin",
    permissions: [
      "create", // Tạo sản phẩm, danh mục, người dùng, đơn hàng,...
      "read", // Xem thông tin sản phẩm, đơn hàng, người dùng,...
      "update", // Chỉnh sửa thông tin sản phẩm, đơn hàng, người dùng,...
      "delete", // Xóa sản phẩm, đơn hàng, người dùng,...
      "manage_users", // Quản lý người dùng (phân quyền, khóa tài khoản,...)
      "view_reports", // Xem báo cáo doanh thu, thống kê
      "manage_orders", // Quản lý đơn hàng
      "admin_pages",
      "manage_inventory", // Quản lý tồn kho
      "manage_discounts", // Quản lý mã giảm giá, khuyến mãi
    ],
  });
  await adminRole.save();

  const userRole = new Role({
    name: "user",
    permissions: [
      "read", // Xem sản phẩm, thông tin tài khoản của họ
      "create_order", // Tạo đơn hàng
      "update_profile", // Chỉnh sửa thông tin cá nhân
      "view_order", // Xem thông tin đơn hàng của họ
      "write_review", // Viết đánh giá sản phẩm
      "create_address",
    ],
  });
  await userRole.save();
  const staffRole = new Role({
    name: "staff",
    permissions: [
      "read", // Xem sản phẩm, đơn hàng
      "update", // Cập nhật thông tin sản phẩm, đơn hàng
      "manage_orders", // Xử lý đơn hàng (xác nhận, giao hàng, cập nhật trạng thái,...)
      "manage_inventory", // Quản lý tồn kho
    ],
  });
  await staffRole.save();
  const managerRole = new Role({
    name: "manager",
    permissions: [
      "read", // Xem sản phẩm, đơn hàng, báo cáo
      "update", // Cập nhật thông tin sản phẩm, đơn hàng
      "manage_orders", // Quản lý đơn hàng
      "manage_inventory", // Quản lý tồn kho
      "view_reports", // Xem báo cáo doanh thu, thống kê
      "manage_discounts", // Quản lý mã giảm giá, khuyến mãi
    ],
  });
  await managerRole.save();

  console.log("Roles have been initialized.");
  mongoose.disconnect();
}

initializeRoles().catch((err) => console.error(err));
