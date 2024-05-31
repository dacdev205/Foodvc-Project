/* eslint-disable react/prop-types */
import React, { useEffect } from "react";

const AddVoucherModal = ({ isModalOpen, setIsModalOpen }) => {
  useEffect(() => {
    if (isModalOpen) {
      document.getElementById("modal-addVoucher").showModal();
    } else {
      document.getElementById("modal-addVoucher").close();
    }
  }, [isModalOpen]);
  return (
    <div>
      {/* <button className="btn" onClick={() => handleOpenModal}>
        open modal
      </button> */}
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
          {/* onSubmit={handleSubmit}  */}
          <form className="card-body text-black" method="dialog">
            <div className="form-control">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="voucherName">Tên voucher:</label>
                  <input
                    id="voucherName"
                    name="voucherName"
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered input-success w-full max-w-xs input-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered input-success w-full max-w-xs"
                  />
                </div>
                <div className="col-span-2">
                  {" "}
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered input-success w-full"
                  />
                </div>
              </div>
            </div>
            <div className="form-control"></div>
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
