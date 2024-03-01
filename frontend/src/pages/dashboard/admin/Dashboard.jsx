import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { MdGroups } from "react-icons/md";
import { CiDollar } from "react-icons/ci";
import { FaBook, FaShoppingCart } from "react-icons/fa";
import FormattedPrice from "../../../components/FormatedPriece";
import ChartMonthlyRevenue from "../../../components/ChartMonthlyRevenue";
const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { refetch, data: stats = [] } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/adminStats");
      return res.data;
    },
  });
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
          <div className="stat-desc">
            {stats.oldestMonth} - {stats.newestMonth}
          </div>
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
        {/* Thêm các biểu đồ vào đây */}
        <div>
          <ChartMonthlyRevenue data={stats} />
        </div>
        <div> </div>
      </div>
    </div>
  );
};

export default Dashboard;
