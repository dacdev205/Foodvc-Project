/* eslint-disable react/prop-types */
import React from "react";

const VoucherModal = ({ isOpen, onClose, vouchers, applyVoucher }) => {
  if (!isOpen) return null;

  const validVouchers = vouchers.filter((voucher) => voucher.voucher_status);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-lg font-semibold mb-4">Chọn Voucher</h2>

        {validVouchers.length === 0 ? (
          <p>Không có voucher nào khả dụng.</p>
        ) : (
          <ul>
            {validVouchers.map((voucher) => (
              <li key={voucher._id} className="mb-2">
                <div className="flex justify-between items-center">
                  <span>
                    {voucher.name} - {voucher.voucher_discount_persent}%
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
        )}

        <button
          className="mt-4 bg-rose-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default VoucherModal;
