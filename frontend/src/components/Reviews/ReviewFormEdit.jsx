/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, useRef } from "react";
import reviewAPI from "../../api/reviewAPI";
import { FaStar } from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";
import styles from "../../CssModule/ReviewForm.module.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReviewFormEdit = ({
  reviewId,
  isModalOpen,
  setIsModalOpen,
  updateReviews,
}) => {
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (reviewId) {
      const fetchReview = async () => {
        try {
          const response = await reviewAPI.getReviewById(reviewId);
          setComment(response.comment);
          setRating(response.rating);
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      };

      fetchReview();
    }
  }, [reviewId]);
  useEffect(() => {
    if (isModalOpen) {
      document.getElementById("modal-reviewEdit").showModal();
    } else {
      document.getElementById("modal-reviewEdit").close();
    }
  }, [isModalOpen]);
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => handleRatingClick(i)}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            color: i <= rating ? "#ffc107" : "#e0e0e0",
            display: "inline-block",
          }}
        >
          <FaStar></FaStar>
        </span>
      );
    }
    return stars;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user && user?.email) {
      await reviewAPI.updateReviewByReviewId(reviewId, { comment, rating });
      setIsModalOpen(false);
      toast.info("Đánh giá đã được chỉnh sửa!", {
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
      updateReviews();
    } else {
      document.getElementById("my_modal_5").showModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRatingClick = (selectedRating) => {
    setRatingError(false);
    setRating(selectedRating);
  };

  return (
    <div>
      <dialog
        id="modal-reviewEdit"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white">
          <span className="flex items-center justify-center font-bold text-lg">
            Đánh giá sản phẩm
          </span>
          <div className="modal-action m-0">
            <form className="card-body" onSubmit={handleSubmit} method="dialog">
              <div className="form-control">
                <label className="label">{renderStars()}</label>
              </div>
              <div className="form-control">
                <textarea
                  className={`review-content mt-3 ${styles.textareaContent}`}
                  rows={10}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn bg-green hover:bg-green hover:opacity-80"
                >
                  <span className="text-white">Gửi đánh giá</span>
                </button>
              </div>
            </form>
            <button
              htmlFor="modal-reviewEdit"
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ReviewFormEdit;
