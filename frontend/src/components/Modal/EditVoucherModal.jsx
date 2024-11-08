/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

const EditVoucherModal = ({ open, onClose, onSubmit, voucher }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [voucherDescribe, setVoucherDescribe] = useState("");
  const [voucherDiscountPercent, setVoucherDiscountPercent] = useState(0);
  const [voucherStatus, setVoucherStatus] = useState(false);
  const [voucherExpiryDate, setVoucherExpiryDate] = useState("");

  useEffect(() => {
    if (voucher) {
      setName(voucher.name || "");
      setCode(voucher.code || "");
      setVoucherDescribe(voucher.voucher_describe || "");
      setVoucherDiscountPercent(voucher.voucher_discount_persent || 0);
      setVoucherStatus(voucher.voucher_status || false);
      setVoucherExpiryDate(
        voucher.voucher_experied_date
          ? voucher.voucher_experied_date.split("T")[0]
          : ""
      );
    }
  }, [voucher]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedVoucher = {
      _id: voucher?._id,
      name,
      code,
      quantity: voucher?.quantity,
      voucher_describe: voucherDescribe,
      voucher_discount_persent: voucherDiscountPercent,
      voucher_status: voucherStatus,
      voucher_experied_date: voucherExpiryDate,
    };
    onSubmit(updatedVoucher);
  };

  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold">Chỉnh sửa thông tin voucher</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block font-medium" htmlFor="voucherName">
              Tên voucher:
            </label>
            <input
              type="text"
              id="voucherName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              aria-label="Tên voucher"
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium" htmlFor="voucherCode">
              Mã voucher:
            </label>
            <input
              type="text"
              id="voucherCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              aria-label="Mã voucher"
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium" htmlFor="voucherDescribe">
              Mô tả voucher:
            </label>
            <textarea
              id="voucherDescribe"
              value={voucherDescribe}
              onChange={(e) => setVoucherDescribe(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              rows="4"
              aria-label="Mô tả voucher"
            />
          </div>

          <div className="mt-4">
            <label
              className="block font-medium"
              htmlFor="voucherDiscountPercent"
            >
              % Giảm:
            </label>
            <input
              type="number"
              id="voucherDiscountPercent"
              value={voucherDiscountPercent}
              onChange={(e) => setVoucherDiscountPercent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              aria-label="% Giảm"
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium" htmlFor="voucherExpiryDate">
              Ngày hết hạn:
            </label>
            <input
              type="date"
              id="voucherExpiryDate"
              value={voucherExpiryDate}
              onChange={(e) => setVoucherExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 mt-1"
              aria-label="Ngày hết hạn"
            />
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={voucherStatus}
                onChange={() => setVoucherStatus(!voucherStatus)}
                className="form-checkbox"
              />
              <span className="ml-2">Voucher hoạt động</span>
            </label>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-lg bg-white border border-green hover:opacity-90 hover:bg-slate-50 text-black mr-3"
            >
              Hủy
            </button>
            <button type="submit" className="btn bg-green text-white">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default EditVoucherModal;
