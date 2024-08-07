/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { FaStar } from "react-icons/fa";
import styles from "../../CssModule/ReviewForm.module.css";
import useUserCurrent from "../../hooks/useUserCurrent";

const ReviewForm = ({ productId, userId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingError, setRatingError] = useState(false);
  const userData = useUserCurrent();
  const handleSubmit = (e) => {
    if (userData?._id) {
      e.preventDefault();
      if (rating === 0) {
        setRatingError(true);
        return;
      }
      onSubmit({ productId, userId, rating, comment });
      setRating(0);
      setComment("");
      setRatingError(false);
      document.getElementById("modal-review").close();
    } else {
      setRating(0);
      setComment("");
      document.getElementById("modal-login").showModal();
    }
  };
  const handleCloseModal = () => {
    setRating(0);
    setComment("");
    setRatingError(false);
    document.getElementById("modal-review").close();
  };
  const handleRatingClick = (selectedRating) => {
    setRatingError(false);
    setRating(selectedRating);
  };

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

  return (
    <div>
      <div className="flex items-center justify-center">
        <button
          className="btn bg-green w-full text-white hover:bg-green hover:opacity-80 border-style"
          onClick={() => document.getElementById("modal-review").showModal()}
        >
          Viết đánh giá
        </button>
      </div>
      <dialog id="modal-review" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white">
          <span className="flex items-center justify-center font-bold text-lg">
            Đánh giá sản phẩm
          </span>
          <div className="modal-action m-0">
            <form className="card-body" onSubmit={handleSubmit} method="dialog">
              <div className="form-control">
                <label className="label">{renderStars()}</label>
                {ratingError && (
                  <span
                    style={{ color: "red" }}
                    size="100px"
                    className="flex justify-center"
                    id="ratingError"
                  >
                    {" "}
                    Please select a rating.
                  </span>
                )}
              </div>
              <div className="form-control">
                <textarea
                  className={styles.textareaContent}
                  rows={10}
                  value={comment}
                  placeholder="Mời bạn chia sẻ cảm nhận..."
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn bg-green hover:bg-green hover:opacity-80 text-white border-none"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
            <button
              htmlFor="modal-review"
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 hover:bg-slate-300"
            >
              ✕
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ReviewForm;
