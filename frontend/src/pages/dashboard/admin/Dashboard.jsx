import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { MdGroups } from "react-icons/md";
import { CiDollar } from "react-icons/ci";
import { FaBook, FaShoppingCart } from "react-icons/fa";
import FormattedPrice from "../../../components/FormatedPriece";
import ChartMonthlyRevenue from "../../../components/ChartMonthlyRevenue";
import ChartProduct from "../../../components/ChartProduct";
import statsAPI from "../../../api/statsAPI";
import ExcelJS from "exceljs";
import useAdmin from "../../../hooks/useAdmin";
const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [productRevenueData, setProductRevenueData] = useState([]);
  const [isAdmin, isAdminLoading] = useAdmin();
  const { refetch, data: stats = [] } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/adminStats");
      return res.data;
    },
  });
  useEffect(() => {
    console.log(monthlyRevenueData);
  }, [monthlyRevenueData]);
  const handleYearChange = async (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    const newData = await statsAPI.fetchDataByYear(year);
    setMonthlyRevenueData(newData);
  };
  const handleMonthChange = async (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    const newData = await statsAPI.fetchDataByMonth(selectedYear, month);
    setProductRevenueData(newData);
  };

  const exportToExcel = (selectedMonth) => {
    if (
      !monthlyRevenueData ||
      !Array.isArray(monthlyRevenueData.monthlyRevenue)
    ) {
      console.error("Invalid monthly revenue data");
      return;
    }

    const selectedMonthData = monthlyRevenueData.monthlyRevenue.find(
      (item) => item._id === selectedMonth
    );
    if (!selectedMonthData) {
      console.error("Selected month data not found");
      return;
    }

    const products = productRevenueData;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Doanh thu tháng ${selectedMonth}`);

    // Add headers
    worksheet.addRow([
      "Tháng",
      "Loại hàng",
      "Tên sản phẩm",
      "Số lượng",
      "Doanh thu",
    ]);

    // Add data rows
    Object.keys(products).forEach((category) => {
      const productInfo = products[category].products.reduce((acc, product) => {
        const existingProduct = acc.find(
          (p) => p["Tên sản phẩm"] === product.name
        );
        if (existingProduct) {
          existingProduct["Số lượng"] += product.quantity;
          existingProduct["Doanh thu"] += product.totalAmount;
        } else {
          acc.push({
            Tháng: selectedMonthData._id,
            "Loại hàng": category,
            "Tên sản phẩm": product.name,
            "Số lượng": product.quantity,
            "Doanh thu": product.totalAmount,
          });
        }
        return acc;
      }, []);
      productInfo.forEach((rowData) => {
        worksheet.addRow(Object.values(rowData));
      });
    });

    // Style the worksheet
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        // Apply styling to cell
        cell.font = { bold: true };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        if (rowNumber === 1) {
          // Header row
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "8FCE00" },
          };
        } else {
          // Data rows
          cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        }
      });
    });

    // Save the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `doanh_thu_thang_${selectedMonth}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="w-full mx-auto px-4">
      <h2 className="text-2xl font-bold my-4 text-black">
        Hi, {user.displayName}
      </h2>
      {isAdmin && (
        <div>
          <div className="stats stats-vertical w-full lg:stats-horizontal shadow bg-white">
            {/* stat div */}
            <div className="stat">
              <div className="stat-figure text-secondary text-3xl">
                <CiDollar />
              </div>
              <div className="stat-title text-black">Doanh thu</div>
              <div className="stat-value">
                <FormattedPrice price={stats.revenue} />
              </div>
              <div className="stat-desc"></div>
            </div>

            <div className="stat ">
              <div className="stat-figure text-secondary text-3xl">
                <MdGroups></MdGroups>
              </div>
              <div className="stat-title text-black">Người dùng</div>
              <div className="stat-value flex text-black">{stats.users}</div>
              <div className="stat-desc">↗︎ 400 (22%)</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary text-3xl">
                <FaBook />
              </div>
              <div className="stat-title text-black">Mặt hàng hiện có</div>
              <div className="stat-value text-black">{stats.menuItems}</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary text-3xl">
                <FaShoppingCart />
              </div>
              <div className="stat-title text-black">Tất cả đơn hàng</div>
              <div className="stat-value text-black">{stats.orders}</div>
              <div className="stat-desc">↘︎ 90 (14%)</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div>
              <p className="text-lg font-bold text-black">
                Xem thống kê doanh thu
              </p>
              <select value={selectedYear} onChange={handleYearChange}>
                <option value={new Date().getFullYear()}>Năm hiện tại</option>
                <option value={"2021"}>Năm 2021</option>
              </select>
              <button
                onClick={() => exportToExcel(selectedMonth)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Export to Excel
              </button>
              <ChartMonthlyRevenue
                data={monthlyRevenueData}
                selectedYear={selectedYear}
              />
            </div>
            <div>
              <p className="text-lg font-bold text-black">
                Danh mục sản phẩm bán được:
              </p>
              <div>
                <select value={selectedMonth} onChange={handleMonthChange}>
                  <option value={"1"}>Tháng 1</option>
                  <option value={"2"}>Tháng 2</option>
                  <option value={"3"}>Tháng 3</option>
                  <option value={"4"}>Tháng 4</option>
                  <option value={"5"}>Tháng 5</option>
                  <option value={"6"}>Tháng 6</option>
                  <option value={"7"}>Tháng 7</option>
                  <option value={"8"}>Tháng 8</option>
                  <option value={"9"}>Tháng 9</option>
                  <option value={"10"}>Tháng 10</option>
                  <option value={"11"}>Tháng 11</option>
                  <option value={"12"}>Tháng 12</option>
                </select>
              </div>
              <ChartProduct data={productRevenueData} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8"></div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
