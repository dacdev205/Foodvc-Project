import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ReportToday = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosSecure.get("/order/reports/today");
        setOrders(response.data);

        let revenue = 0;
        let productsSold = 0;
        response.data.forEach((order) => {
          revenue += order.totalAmount;
          productsSold += order.products.reduce(
            (acc, product) => acc + product.quantity,
            0
          );
        });
        setTotalRevenue(revenue);
        setTotalProductsSold(productsSold);
        setTotalOrders(response.data.length);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [axiosSecure]);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Báo cáo");

    // Thêm tiêu đề "BÁO CÁO DOANH THU HÔM NAY"
    const titleRow = worksheet.addRow(["BÁO CÁO DOANH THU HÔM NAY"]);
    titleRow.font = { bold: true, size: 16 };
    worksheet.mergeCells(`A${titleRow.number}:E${titleRow.number}`); // Merge các ô trong hàng chứa tiêu đề

    // Thêm dòng trống
    worksheet.addRow([]);

    // Định dạng cột
    const columns = [
      { header: "Mã đơn", key: "orderCode", width: 20 },
      { header: "Trạng thái đơn hàng", key: "status", width: 20 },
      { header: "Đơn giá", key: "totalAmount", width: 15 },
      { header: "Địa chỉ nhận hàng", key: "address", width: 50 },
      { header: "Sản phẩm", key: "products", width: 50 },
    ];
    worksheet.columns = columns;
    // Thêm dữ liệu từ orders
    orders.forEach((order) => {
      worksheet.addRow({
        orderCode: order.orderCode,
        status: order.status,
        totalAmount: order.totalAmount,
        address: `${order.address.street}, ${order.address.city}, ${order.address.district}`,
        products: order.products
          .map(
            (product) => `Name: ${product.name}, Số lượng: ${product.quantity}`
          )
          .join("\n"),
      });
    });

    // Thêm tổng kết
    worksheet.addRow({
      orderCode: "Tổng doanh thu ngày",
      totalAmount: totalRevenue,
    });
    worksheet.addRow({
      orderCode: "Số lượng sản phẩm bán ra",
      totalAmount: totalProductsSold,
    });
    worksheet.addRow({
      orderCode: "Số lượng đơn hàng được tạo",
      totalAmount: totalOrders,
    });
    worksheet.addRow({ orderCode: "Người lập", totalAmount: user.displayName });

    // Định dạng ô
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // Tạo file Excel và tải về
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "bao_cao_hom_nay.xlsx");
  };

  return (
    <div className="overflow-none">
      <h1 className="text-lg text-black">Các đơn hơn đã tạo trong hôm nay:</h1>
      <table className="table text-black">
        {/* head */}
        <thead>
          <tr className="text-black">
            <th>Mã đơn</th>
            <th>Trạng thái đơn hàng</th>
            <th>Đơn giá</th>
            <th>Address</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderCode}</td>
              <td>{order.status}</td>
              <td>{order.totalAmount}</td>
              <td>
                {order.address.street}, {order.address.city},{" "}
                {order.address.district}
              </td>
              <td>
                <ul>
                  {order.products.map((product) => (
                    <li key={product._id}>
                      <p>Name: {product.name.slice(0, 10)}...</p>
                      <p>Số lượng: {product.quantity}</p>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Số lượng đơn hàng được tạo: {totalOrders}</div>
      <div>Số lượng sản phẩm bán ra: {totalProductsSold}</div>
      <div>Tổng doanh thu ngày: {totalRevenue}</div>
      <div>Người lập:{user.displayName}</div>
      <button className="btn btn-primary" onClick={exportToExcel}>
        Xuất báo cáo
      </button>
    </div>
  );
};

export default ReportToday;
