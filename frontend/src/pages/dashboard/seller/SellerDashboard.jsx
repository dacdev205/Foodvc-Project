import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { CiDollar } from "react-icons/ci";
import { FaBook, FaShoppingCart } from "react-icons/fa";
import FormattedPrice from "../../../ultis/FormatedPriece";
import ChartMonthlyRevenue from "../../../components/Chart/ChartMonthlyRevenue";
import ChartProduct from "../../../components/Chart/ChartProduct";
import sellerStats from "../../../api/sellerStats";
import ExcelJS from "exceljs";
import useUserCurrent from "../../../hooks/useUserCurrent";

const SellerDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [productRevenueData, setProductRevenueData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState("");

  const userData = useUserCurrent();
  const shopId = userData?.shops[0];

  const {
    refetch,
    data: stats = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["stats", shopId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellerStats/${shopId}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (shopId) {
      refetch();
    }
  }, [shopId, refetch]);

  const handleYearChange = async (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    if (shopId) {
      const newData = await sellerStats.fetchDataByYear(shopId, year);
      setMonthlyRevenueData(newData);
    }
  };

  const handleMonthChange = async (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    if (shopId) {
      const newData = await sellerStats.fetchDataByMonth(
        shopId,
        selectedYear,
        month
      );
      setProductRevenueData(newData);
    }
  };

  const exportToExcel = async (data, startDate, endDate) => {
    if (!data || typeof data !== "object") {
      console.error("Invalid data");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Doanh thu`);

    worksheet.mergeCells("A1:D1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `BÁO CÁO DOANH THU ${startDate} đến ${endDate} `;
    titleCell.alignment = { horizontal: "center" };
    titleCell.font = { bold: true, size: 16 };

    const headers = ["Loại hàng", "Tên sản phẩm", "Số lượng", "Doanh thu"];
    worksheet.addRow(headers);

    Object.keys(data).forEach((category) => {
      data[category].products.forEach((product) => {
        const rowData = [
          category,
          product.name,
          product.quantity,
          product.totalAmount,
        ];
        worksheet.addRow(rowData);
      });
    });

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 20;

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `doanh_thu.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleResultClick = async () => {
    try {
      if (shopId) {
        const data = await sellerStats.fetchSoldProducts(
          shopId,
          startDate,
          endDate
        );
        setResult(data);
        await exportToExcel(data, startDate, endDate);
      }
    } catch (error) {
      console.error("Error handling result click:", error);
    }
  };

  return (
    <div className="w-full mx-auto px-4">
      <h2 className="text-2xl font-bold my-4 text-black">
        Hi, {user.displayName}
      </h2>
      <div>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading data</div>}
        <div className="stats stats-vertical w-full lg:stats-horizontal shadow bg-white">
          <div className="stat">
            <div className="stat-figure text-secondary text-3xl">
              <CiDollar />
            </div>
            <div className="stat-title text-black">Doanh thu</div>
            <div className="stat-value">
              <FormattedPrice price={stats.revenue} />
            </div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary text-3xl">
              <FaBook />
            </div>
            <div className="stat-title text-black">Mặt hàng hiện có</div>
            <div className="stat-value text-black">{stats.menuItems}</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary text-3xl">
              <FaShoppingCart />
            </div>
            <div className="stat-title text-black">Tất cả đơn hàng</div>
            <div className="stat-value text-black">{stats.orders}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div>
            <p className="text-lg font-bold text-black">
              Xem thống kê doanh thu
            </p>
            <select value={selectedYear} onChange={handleYearChange}>
              <option value={new Date().getFullYear()}>Năm hiện tại</option>
              <option value="2023">Năm 2023</option>
              {/* Add more years dynamically if needed */}
            </select>
            <ChartMonthlyRevenue
              data={monthlyRevenueData}
              selectedYear={selectedYear}
            />
          </div>
          <div>
            <p className="text-lg font-bold text-black">
              Danh mục sản phẩm bán được:
            </p>
            <select value={selectedMonth} onChange={handleMonthChange}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>{`Tháng ${i + 1}`}</option>
              ))}
            </select>
            <ChartProduct data={productRevenueData} />
          </div>
        </div>
        <div className="mt-8">
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={handleResultClick} className="btn btn-primary">
              Xuất báo cáo
            </button>
          </div>
          {result && (
            <div className="mt-4">Kết quả: {JSON.stringify(result)}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
