import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import reviewAPI from "../../../api/reviewAPI";
import { FaTrash } from "react-icons/fa";
import Pagination from "../../../ultis/Pagination";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [stats, setStats] = useState({
    total_reviews: 0,
    positive_reviews: 0,
    negative_reviews: 0,
    positive_percentage: 0,
    negative_percentage: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchReviewsAndStats = async () => {
    try {
      const reviewsResponse = await axios.get("http://localhost:5000/data");
      setReviews(reviewsResponse.data);

      const statsResponse = await axios.get(
        "http://localhost:5000/sentiment-stats"
      );
      setStats(statsResponse.data);
    } catch (error) {
      console.error("There was an error fetching data!", error);
    }
  };

  useEffect(() => {
    fetchReviewsAndStats();
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.comment
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment
      ? review.sentiment === filterSentiment
      : true;
    return matchesSearch && matchesSentiment;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const chartData = {
    labels: ["Đánh giá tích cực", "Đánh giá tiêu cực"],
    datasets: [
      {
        label: "Sentiment Distribution",
        data: [stats.positive_reviews, stats.negative_reviews],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)", // Positive color
          "rgba(255, 99, 132, 0.5)", // Negative color
        ],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} (${(
              (tooltipItem.raw / stats.total_reviews) *
              100
            ).toFixed(2)}%)`;
          },
        },
      },
    },
  };

  const handleDelete = async (id) => {
    try {
      await reviewAPI.deleteCommentByReviewId(id);
      setShowConfirmModal(false);
      setReviewToDelete(null);
      await fetchReviewsAndStats();
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      handleDelete(reviewToDelete);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">đánh giá</span>
      </h2>

      <h2 className="text-md mb-4 text-gray-800">
        Tổng tất cả đánh giá: {stats.total_reviews}
      </h2>
      <div className="flex items-center my-2">
        <input
          type="text"
          placeholder="Tìm kiếm bình luận..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-sm"
        />
        <select
          value={filterSentiment}
          onChange={(e) => setFilterSentiment(e.target.value)}
          className="select select-sm ml-2"
        >
          <option value="">Tất cả cảm xúc</option>
          <option value="positive">Tích Cực</option>
          <option value="negative">Tiêu Cực</option>
        </select>
      </div>

      <table className="table md:w-[870px]">
        <thead className="bg-green text-white rounded-lg text-center">
          <tr className="border-style">
            <th>STT</th>
            <th>Tên hiển thị</th>
            <th>Điểm sao</th>
            <th>Bình luận</th>
            <th>Cảm Xúc</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {currentReviews.map((review, index) => (
            <tr
              key={review._id}
              className="border-gray-300 text-black text-center"
            >
              <td>{index + 1 + indexOfFirstItem}</td>
              <td>{review.userName}</td>
              <td>{review.rating}</td>
              <td className="tooltip tooltip-bottom" data-tip={review.comment}>
                {review.comment.slice(0, 30)}...
              </td>
              <td>
                {review.sentiment === "positive" ? "Tích Cực" : "Tiêu Cực"}
              </td>
              <td className="py-2 px-4 flex space-x-2 justify-center">
                <button
                  className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                  onClick={() => handleDeleteClick(review._id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-[290px] max-w-3xl mx-auto mt-8">
        <Pie data={chartData} options={chartOptions} />
      </div>

      <ConfirmDeleteModal
        showModal={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteReview}
        title="Xác nhận xóa đánh giá"
        message="Bạn có chắc chắn muốn xóa đánh giá này?"
      />

      {/* Pagination */}
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredReviews.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default ReviewsManagement;
