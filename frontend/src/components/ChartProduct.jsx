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
      const ctx = chartRef.current.getContext("2d");

      const categories = Object.keys(data);
      const quantities = categories.map((category) =>
        data[category].products.reduce(
          (total, product) => total + product.quantity,
          0
        )
      );
      const revenues = categories.map((category) =>
        data[category].products.reduce(
          (total, product) => total + product.totalAmount,
          0
        )
      );

      const chartLabels = categories.map((category) =>
        category === "milk"
          ? "Sữa các loại"
          : category === "drinks"
          ? "Bia, nước giải khát"
          : category === "popular"
          ? "Nổi bật"
          : category === "soup"
          ? "Mì, miến, cháo, phở"
          : category === "vegetable"
          ? "Rau, củ, nấm, trái cây"
          : category === "protein"
          ? "Thịt, cá, trứng, hải sản"
          : category
      );

      newChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: chartLabels,
          datasets: [
            {
              label: "Số lượng",
              data: quantities,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
              ],
              borderWidth: 1,
            },
            {
              label: "Doanh thu",
              data: revenues,
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
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
      <canvas ref={chartRef} className="canvas-size"></canvas>{" "}
    </div>
  );
};

export default ChartProduct;
