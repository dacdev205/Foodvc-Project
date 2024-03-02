/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ChartProduct = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    let newChartInstance = null;
    if (chartInstance) {
      chartInstance.destroy();
    }
    if (chartRef.current && data) {
      // Kiểm tra nếu có dữ liệu
      const ctx = chartRef.current.getContext("2d");
      newChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(data), // Sử dụng tên các danh mục làm nhãn
          datasets: [
            {
              label: "Doanh Thu",
              data: Object.values(data), // Sử dụng số lượng sản phẩm làm dữ liệu
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
              ],

              borderWidth: 1,
            },
          ],
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
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartProduct;
