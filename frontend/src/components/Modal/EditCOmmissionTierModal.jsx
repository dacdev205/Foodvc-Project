/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

const EditCommissionTierModal = ({ open, onClose, tier, onSaveTier }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [revenueRequired, setRevenueRequired] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  useEffect(() => {
    if (tier) {
      setName(tier.name);
      setDescription(tier.description);
      setRevenueRequired(tier.revenueRequired);
      setCommissionRate(tier.commissionRate);
    }
  }, [tier, open]);

  const handleSubmit = () => {
    if (!name) {
      toast.warn("Tên cấp bậc hoa hồng không được bỏ trống", {
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
    if (!description) {
      toast.warn("Mô tả cấp bậc không được bỏ trống", {
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
    if (!revenueRequired || isNaN(revenueRequired)) {
      toast.warn("Doanh thu yêu cầu phải là một số", {
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
    if (!commissionRate || isNaN(commissionRate)) {
      toast.warn("Tỷ lệ hoa hồng phải là một số", {
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

    onSaveTier({
      _id: tier._id,
      name,
      description,
      revenueRequired: revenueRequired,
      commissionRate: commissionRate,
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
          Chỉnh sửa cấp bậc hoa hồng
        </h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên cấp bậc hoa hồng"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Mô tả cấp bậc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Doanh thu yêu cầu"
          value={revenueRequired}
          onChange={(e) => setRevenueRequired(e.target.value)}
        />
        <input
          type="number"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tỷ lệ hoa hồng (%)"
          value={commissionRate}
          onChange={(e) => setCommissionRate(e.target.value)}
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

export default EditCommissionTierModal;
