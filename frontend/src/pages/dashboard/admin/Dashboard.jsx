import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { MdGroups } from "react-icons/md";
import { CiDollar } from "react-icons/ci";
import { FaBook, FaShoppingCart } from "react-icons/fa";
import FormattedPrice from "../../../components/FormatedPriece";
import ChartMonthlyRevenue from "../../../components/ChartMonthlyRevenue";
import ChartProduct from "../../../components/ChartProduct";
// import ChartBar from "../../../components/ChartBar";

import statsAPI from "../../../api/statsAPI";
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
  const handleYearChange = async (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    // Sau khi refetch hoàn thành, gọi fetchDataByYear để lấy dữ liệu cho năm mới
    const newData = await statsAPI.fetchDataByYear(year);
    setMonthlyRevenueData(newData);
  };
  const handleMonthChange = async (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    const newData = await statsAPI.fetchDataByMonth(selectedYear, month);
    setProductRevenueData(newData);
  };
  return (
    <div className="w-full mx-auto px-4">
      <h2 className="text-2xl font-bold my-4">Hi, {user.displayName}</h2>
      <div className="stats stats-vertical w-full lg:stats-horizontal shadow">
        {/* stat div */}
        <div className="stat">
          <div className="stat-figure text-secondary text-3xl">
            <CiDollar />
          </div>
          <div className="stat-title">Doanh thu</div>
          <div className="stat-value">
            <FormattedPrice price={stats.revenue} />
          </div>
          <div className="stat-desc"></div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary text-3xl">
            <MdGroups></MdGroups>
          </div>
          <div className="stat-title">Người dùng</div>
          <div className="stat-value flex">{stats.users}</div>
          <div className="stat-desc">↗︎ 400 (22%)</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary text-3xl">
            <FaBook />
          </div>
          <div className="stat-title">Mặt hàng hiện có</div>
          <div className="stat-value">{stats.menuItems}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary text-3xl">
            <FaShoppingCart />
          </div>
          <div className="stat-title">Tất cả đơn hàng</div>
          <div className="stat-value">{stats.orders}</div>
          <div className="stat-desc">↘︎ 90 (14%)</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div>
          <p className="text-lg font-bold">Xem thống kê doanh thu</p>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value={new Date().getFullYear()}>Năm hiện tại</option>
            <option value={"2021"}>Năm 2021</option>
          </select>
          <ChartMonthlyRevenue
            data={monthlyRevenueData}
            selectedYear={selectedYear}
          />
          <p className="text-lg font-bold">Các danh mục khác:</p>
          {/* <ChartBar data={stats}></ChartBar> */}
        </div>
        <div>
          <p className="text-lg font-bold">Danh mục sản phẩm bán được:</p>
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
    </div>
  );
};

export default Dashboard;
