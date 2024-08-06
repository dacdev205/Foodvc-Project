/* eslint-disable react/prop-types */
import React from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, review }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-lg font-semibold mb-4">Xóa Đánh Giá</h2>
        <p className="mb-4">Bạn có chắc chắn muốn xóa đánh giá này không?</p>
        <div className="flex justify-end">
          <button
            className=" text-gray-800 px-4 py-2 rounded mr-2 hover:bg-slate-50"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-rose-500 hover:bg-rose-500 hover:opacity-80 text-white px-4 py-2 rounded"
            onClick={() => {
              onConfirm(review._id);
              onClose();
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
