import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import reviewAPI from "../../../api/reviewAPI";
import { FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import userAPI from "../../../api/userAPI";
import { CircularProgress, Pagination } from "@mui/material";
import useUserCurrent from "../../../hooks/useUserCurrent";
import { Bounce, toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSentiment, setFilterSentiment] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [stats, setStats] = useState({
    totalReviews: 0,
    positiveReviews: 0,
    negativeReviews: 0,
    positivePercentage: 0,
    negativePercentage: 0,
  });
  const title = "Xóa bình luận";
  const message = "Bạn có chắc muốn xóa bình luận này?";
  const isAdmin = userData?.roles.some((role) => role?.name?.includes("admin"));

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = isAdmin
        ? await axios.get("http://localhost:3000/reviews-admin", {
            params: {
              page,
              limit: 5,
              searchTerm,
              sentiment: filterSentiment,
            },
          })
        : await axios.get(`http://localhost:3000/reviews`, {
            params: {
              page,
              limit: 5,
              shopId,
              searchTerm,
              sentiment: filterSentiment,
            },
          });

      const {
        reviews,
        totalPages,
        totalReviews,
        positiveReviews,
        negativeReviews,
        positivePercentage,
        negativePercentage,
      } = response.data;

      const reviewsWithUserDetails = await Promise.all(
        reviews.map(async (review) => {
          const userResponse = await userAPI.getSingleUserById(review.userId);
          return { ...review, userName: userResponse.name };
        })
      );
      setReviews(reviewsWithUserDetails);
      setTotalPages(totalPages);
      setStats({
        totalReviews: totalReviews,
        positiveReviews: positiveReviews,
        negativeReviews: negativeReviews,
        positivePercentage: positivePercentage,
        negativePercentage: negativePercentage,
      });
    } catch (error) {
      console.error("Error fetching reviews!", error);
    } finally {
      setLoading(false);
    }
  }, [filterSentiment, isAdmin, page, searchTerm, shopId]);

  useEffect(() => {
    if (userData) {
      fetchReviews();
    }
  }, [fetchReviews, userData]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleDelete = async (id) => {
    try {
      await reviewAPI.deleteReviewByReviewId(id);
      setShowConfirmModal(false);
      setReviewToDelete(null);
      fetchReviews();
      toast.success("Đánh giá đã được xóa", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      toast.success("Xảy ra lỗi khi xóa đánh giá", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      console.error("Failed to delete review:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setShowConfirmModal(true);
    setReviewToDelete(id);
  };

  const confirmDeleteReview = () => {
    if (reviewToDelete) {
      handleDelete(reviewToDelete);
    }
  };
  const handleAnalyzeSentiment = async () => {
    setAnalyzing(true);
    try {
      const updatedReviews = [...reviews];

      for (let i = 0; i < updatedReviews.length; i++) {
        const review = updatedReviews[i];
        const response = await axios.post(
          "http://localhost:5000/analyze-sentiment",
          {
            reviewId: review._id,
            comment: review.comment,
          }
        );

        const sentiment = response.data.sentiment;

        await axios.post("http://localhost:3000/reviews/update-sentiment", {
          reviewId: review._id,
          sentiment,
        });

        updatedReviews[i].sentiment = sentiment;
      }

      setReviews(updatedReviews);
      setIsAnalyzed(true);
    } catch (error) {
      console.error("Error analyzing sentiment or updating database:", error);
    } finally {
      setAnalyzing(false);
    }
  };
  const chartData = {
    labels: ["Đánh giá tích cực", "Đánh giá tiêu cực"],
    datasets: [
      {
        label: "Sentiment Distribution",
        data: [stats.positiveReviews, stats.negativeReviews],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
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
              (tooltipItem.raw / stats.totalReviews) *
              100
            ).toFixed(2)}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">đánh giá</span>
      </h2>

      <h2 className="text-md mb-4 text-gray-800">
        Tổng tất cả đánh giá: {reviews?.length}
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
          <option value="none">Chưa phân tích</option>
          <option value="positive">Tích Cực</option>
          <option value="negative">Tiêu Cực</option>
        </select>
      </div>
      {/* Raw Data Section */}
      <h3 className="text-lg font-semibold my-4">Dữ liệu Gốc</h3>
      <table className="table md:w-[870px] shadow-lg">
        <thead className="bg-green text-white rounded-lg text-center">
          <tr>
            <th>STT</th>
            <th>Tên người dùng</th>
            <th>Điểm sao</th>
            <th>Bình luận</th>
            <th>Cảm xúc</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                <CircularProgress color="success" />
              </td>
            </tr>
          ) : reviews.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Không có đánh giá nào.
              </td>
            </tr>
          ) : (
            reviews.map((review, index) => (
              <tr
                key={review._id}
                className="border-gray-300 text-black text-center"
              >
                <td>{index + 1}</td>
                <td>{review.userName}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  {review.sentiment === "positive"
                    ? "Tích cực"
                    : review.sentiment === "negative"
                    ? "Tiêu cực"
                    : "Chưa phân tích"}
                </td>
                <td>{new Date(review.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button
        onClick={handleAnalyzeSentiment}
        className="border rounded-lg  border-yellow-500 text-yellow-500 px-3 flex float-end m-2"
        disabled={analyzing}
      >
        {analyzing ? "Đang phân tích..." : "Phân tích"}
      </button>

      {/* Sentiment Analysis Section */}
      {isAnalyzed && (
        <div>
          <h3 className="text-lg font-semibold my-4">
            Sau khi phân tích đánh giá
          </h3>

          <table className="table md:w-[870px] shadow-lg">
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  Không có đánh giá nào.
                </td>
              </tr>
            ) : (
              <tbody>
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
                    {reviews.map((review, index) => (
                      <tr
                        key={review._id}
                        className="border-gray-300 text-black text-center"
                      >
                        <td>{index + 1}</td>
                        <td>{review.userName}</td>
                        <td>{review.rating}</td>
                        <td
                          className="tooltip tooltip-bottom"
                          data-tip={review.comment}
                        >
                          {review.comment.slice(0, 30)}...
                        </td>
                        <td>
                          {review.sentiment === "positive"
                            ? "Tích cực"
                            : review.sentiment === "negative"
                            ? "Tiêu cực"
                            : "Chưa phân tích"}
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteClick(review._id)}
                            className="bg-red text-white p-2 rounded-md"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </tbody>
            )}
            <div className="flex justify-center mt-4">
              {totalPages > 0 && (
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="success"
                />
              )}
            </div>
          </table>

          <div className="w-[290px] max-w-3xl mx-auto mt-8">
            <Pie data={chartData} options={chartOptions} />
          </div>

          {showConfirmModal && (
            <ConfirmDeleteModal
              title={title}
              message={message}
              showModal={showConfirmModal}
              onClose={() => setShowConfirmModal(false)}
              onConfirm={confirmDeleteReview}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
