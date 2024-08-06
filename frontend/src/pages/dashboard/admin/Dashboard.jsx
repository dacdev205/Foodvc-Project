import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { MdGroups } from "react-icons/md";
import { CiDollar } from "react-icons/ci";
import { FaBook, FaShoppingCart } from "react-icons/fa";
import FormattedPrice from "../../../ultis/FormatedPriece";
import ChartMonthlyRevenue from "../../../components/Chart/ChartMonthlyRevenue";
import ChartProduct from "../../../components/Chart/ChartProduct";
import statsAPI from "../../../api/statsAPI";
import ExcelJS from "exceljs";
import axios from "axios";
const Dashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [productRevenueData, setProductRevenueData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState("");

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
    const newData = await statsAPI.fetchDataByYear(year);
    setMonthlyRevenueData(newData);
  };
  const handleMonthChange = async (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    const newData = await statsAPI.fetchDataByMonth(selectedYear, month);
    setProductRevenueData(newData);
  };

  const exportToExcel = (data, startDate, endDate) => {
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

    const columnWidths = [
      { header: "Tháng", key: "Tháng", width: 15 },
      { header: "Loại hàng", key: "Loại hàng", width: 20 },
      { header: "Tên sản phẩm", key: "Tên sản phẩm", width: 25 },
      { header: "Số lượng", key: "Số lượng", width: 15 },
      { header: "Doanh thu", key: "Doanh thu", width: 20 },
    ];

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

    columnWidths.forEach((column, index) => {
      const columnIndex = index + 1;
      const columnKey = worksheet.getColumn(columnIndex);
      if (columnKey) columnKey.width = column.width;
      else console.error(`Column '${column.key}' not found`);
    });

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        const isSecondRow = rowNumber === 2;
        if (isSecondRow) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "8FCE00" },
          };
          cell.alignment = { vertical: "middle", horizontal: "center" };
        }
        const borderStyles = {
          top: "thin",
          bottom: "thin",
          left: "thin",
          right: "thin",
        };
        cell.border = isSecondRow
          ? borderStyles
          : { ...borderStyles, horizontal: "center" };
      });
    });

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

  const handleResultClick = () => {
    axios
      .post(
        `http://localhost:3000/adminStats/products/sold?startDate=${startDate}&endDate=${endDate}`
      )
      .then((response) => {
        const data = response.data;
        setResult(data);
        exportToExcel(data, startDate, endDate);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="w-full mx-auto px-4">
      <h2 className="text-2xl font-bold my-4 text-black">
        Hi, {user.displayName}
      </h2>
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
              <option value={"2023"}>Năm 2023</option>
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
            <div className="flex">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
              <p className="flex items-center m-3 text-black">Đến:</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="appearance-none block bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              />
            </div>
            <div>
              <button
                className="btn btn-primary mt-3 text-white"
                onClick={() => handleResultClick()}
              >
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
