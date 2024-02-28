/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ChartComponent = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    let newChartInstance = null;

    if (chartInstance) {
      chartInstance.destroy();
    }

    if (chartRef.current && data) {
      const ctx = chartRef.current.getContext("2d");
      newChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Người dùng", "Mặt hàng hiện có", "Đơn hàng đã đặt"],
          datasets: [
            {
              label: "Số lượng",
              data: [data.users, data.menuItems, data.orders],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      setChartInstance(newChartInstance);
    }

    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [data]);

  return (
    <div>
      <canvas
        ref={chartRef}
        style={{ width: "100px", height: "" }} // Thay đổi kích thước ở đây
      ></canvas>
    </div>
  );
};

export default ChartComponent;
