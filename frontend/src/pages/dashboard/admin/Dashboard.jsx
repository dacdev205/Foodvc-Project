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
import * as XLSX from "xlsx";
const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [productRevenueData, setProductRevenueData] = useState([]);

  const { refetch, data: stats = [] } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/adminStats");
      return res.data;
    },
  });
  useEffect(() => {
    console.log(productRevenueData);
  }, [productRevenueData]);
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
    const data = [];
    Object.keys(products).forEach((category) => {
      const productInfo = products[category].products[0];
      const productData = {
        Tháng: selectedMonthData._id,
        "Loại hàng": category,
        "Tên sản phẩm": productInfo.name,
        "Số lượng": productInfo.quantity,
        "Doanh thu": productInfo.totalAmount,
      };

      data.push(productData);
    });
    const ws = XLSX.utils.json_to_sheet(data);
    // Define border style
    const borderStyle = {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    };

    // Apply border to all cells
    const range = XLSX.utils.decode_range(ws["!ref"]);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = { c: C, r: R };
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        ws[cellRef].s = { border: borderStyle };
      }
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Doanh thu tháng ${selectedMonth}`);
    XLSX.writeFile(wb, `doanh_thu_thang_${selectedMonth}.xlsx`);
  };

  return (
    <div className="w-full mx-auto px-4">
      <h2 className="text-2xl font-bold my-4 text-black">
        Hi, {user.displayName}
      </h2>
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
          <p className="text-lg font-bold text-black">Xem thống kê doanh thu</p>
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
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          <p className="text-lg font-bold text-black">Xem thống kê doanh thu</p>
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
      </div>
    </div>
  );
};

export default Dashboard;
