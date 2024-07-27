/* eslint-disable react/prop-types */
// src/components/ConfirmDeleteModal.js
import React from "react";

const ConfirmDeleteModal = ({
  showModal,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box relative bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">{title}</h2>
          <p className="mb-4 text-black">{message}</p>
          <div className="modal-action flex justify-end">
            <button
              onClick={onClose}
              className="btn bg-white border-none text-black hover:bg-slate-100 mr-2 px-6"
            >
              Trở lại
            </button>
            <button
              onClick={onConfirm}
              className="btn bg-green border-none text-white px-6 hover:bg-green hover:opacity-80"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 bg-black opacity-50"></div>
    </div>
  );
};

export default ConfirmDeleteModal;
