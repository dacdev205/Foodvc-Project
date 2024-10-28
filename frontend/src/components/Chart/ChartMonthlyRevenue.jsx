/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ChartMonthlyRevenue = ({ data, selectedYear }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    let newChartInstance = null;
    if (chartInstance) {
      chartInstance.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const monthNames = [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ];

      const labels = Array.from(
        { length: 12 },
        (_, index) => monthNames[index]
      );
      const values = Array.from({ length: 12 }, () => null);

      if (data && data.monthlyRevenue) {
        data.monthlyRevenue.forEach((item) => {
          const monthIndex = item._id - 1;
          values[monthIndex] = item.totalRevenue; // Update here
        });
      }

      newChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: `Doanh Thu ${selectedYear}`,
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 3,
              cubicInterpolationMode: "monotone",
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
  }, [data, selectedYear]);

  return (
    <div>
      <canvas ref={chartRef} className="chart-line-style" />
    </div>
  );
};

export default ChartMonthlyRevenue;
