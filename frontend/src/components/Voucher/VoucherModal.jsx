/* eslint-disable react/prop-types */
import React from "react";

const VoucherModal = ({ isOpen, onClose, vouchers, applyVoucher }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-lg font-semibold mb-4">Chọn Voucher</h2>
        <ul>
          {vouchers.map((voucher) => (
            <li key={voucher._id} className="mb-2">
              <div className="flex justify-between items-center">
                <span>
                  {voucher.name} - {voucher.discount}%
                </span>
                <button
                  className="bg-green text-white px-4 py-2 rounded"
                  onClick={() => applyVoucher(voucher)}
                >
                  Áp dụng
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default VoucherModal;
