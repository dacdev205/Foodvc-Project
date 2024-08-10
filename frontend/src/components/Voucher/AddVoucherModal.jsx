/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import voucherAPI from "../../api/voucherAPI";

const AddVoucherModal = ({ isModalOpen, setIsModalOpen }) => {
  const [voucherName, setVoucherName] = useState("");
  const [voucherDescribe, setVoucherDescribe] = useState("");
  const [voucherDiscountPercent, setVoucherDiscountPercent] = useState("");
  const [voucherStatus, setVoucherStatus] = useState("");
  const [voucherExpiredDate, setVoucherExpiredDate] = useState("");
  const token = localStorage.getItem("access-token");

  useEffect(() => {
    if (isModalOpen) {
      document.getElementById("modal-addVoucher").showModal();
    } else {
      document.getElementById("modal-addVoucher").close();
    }
  }, [isModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newVoucher = {
        name: voucherName,
        voucher_describe: voucherDescribe,
        voucher_discount_persent: voucherDiscountPercent,
        voucher_status: voucherStatus,
        voucher_experied_date: voucherExpiredDate,
      };
      await voucherAPI.createVoucher(newVoucher);
      toast.success("Cập nhật thành công!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating voucher:", error);
    }
  };

  return (
    <div>
      <dialog id="modal-addVoucher" className="modal">
        <div className="modal-box bg-white">
          <form method="dialog">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-black">Thêm mới voucher!</h3>
          <form className="card-body text-black" onSubmit={handleSubmit}>
            <div className="form-control">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="voucherName">Tên voucher:</label>
                  <input
                    id="voucherName"
                    name="voucherName"
                    type="text"
                    value={voucherName}
                    onChange={(e) => setVoucherName(e.target.value)}
                    placeholder="Nhập tên voucher"
                    className="input input-bordered w-full max-w-xs input-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="voucherDescribe">Mô tả voucher:</label>
                  <input
                    id="voucherDescribe"
                    name="voucherDescribe"
                    type="text"
                    value={voucherDescribe}
                    onChange={(e) => setVoucherDescribe(e.target.value)}
                    placeholder="Mô tả voucher"
                    className="input input-bordered -full max-w-xs input-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="voucherDiscountPercent">
                    Phần trăm giảm giá:
                  </label>
                  <input
                    id="voucherDiscountPercent"
                    name="voucherDiscountPercent"
                    type="number"
                    value={voucherDiscountPercent}
                    onChange={(e) => setVoucherDiscountPercent(e.target.value)}
                    placeholder="VD: 10 (%)"
                    className="input input-bordered input-success w-full max-w-xs input-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="voucherStatus">Trạng thái:</label>
                  <select
                    onChange={(e) => setVoucherStatus(e.target.value)}
                    name="voucherStatus"
                    id="voucherStatus"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>
                <div className="col-span-2 text-black">
                  <label htmlFor="voucherExpiredDate">Ngày hết hạn:</label>
                  <input
                    id="voucherExpiredDate"
                    name="voucherExpiredDate"
                    type="date"
                    value={voucherExpiredDate}
                    onChange={(e) => setVoucherExpiredDate(e.target.value)}
                    className="input input-bordered input-success w-full bg-white"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn bg-green hover:bg-green hover:opacity-80 hover:border-transparent border-transparent"
              >
                <span className="text-white">Thêm mới voucher</span>
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AddVoucherModal;
