/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const EditUserRankModal = ({ open, onClose, userRank, onSaveUserRank }) => {
  const [rankName, setRankName] = useState("");
  const [discount, setDiscount] = useState("");
  const [rankPoints, setRankPoints] = useState("");

  useEffect(() => {
    if (userRank) {
      setRankName(userRank.user_rank_name);
      setDiscount(userRank.user_discount);
      setRankPoints(userRank.user_rank_point);
    }
  }, [userRank, open]);

  const handleSubmit = () => {
    if (!rankName) {
      toast.warn("Tên cấp bậc không được bỏ trống", {
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
      return;
    }
    if (discount === "" || isNaN(discount)) {
      toast.warn("Giảm giá phải là một số", {
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
      return;
    }
    if (rankPoints === "" || isNaN(rankPoints)) {
      toast.warn("Điểm cấp bậc phải là một số", {
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
      return;
    }

    onSaveUserRank({
      _id: userRank._id,
      user_rank_name: rankName,
      user_discount: Number(discount),
      user_rank_point: Number(rankPoints),
    });

    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        open ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          Chỉnh sửa cấp bậc người dùng
        </h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên cấp bậc người dùng"
          value={rankName}
          onChange={(e) => setRankName(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Giảm giá (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Điểm cấp bậc"
          value={rankPoints}
          onChange={(e) => setRankPoints(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-green text-white rounded hover:bg-green-600 mt-4"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditUserRankModal;
