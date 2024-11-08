/* eslint-disable react/prop-types */
import React from "react";
import { useForm } from "react-hook-form";

const UpdateQuantityModal = ({ open, onClose, onSubmit, initialQuantity }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { quantity: initialQuantity },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Cập nhật số lượng
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số lượng
            </label>
            <input
              {...register("quantity", {
                required: "Số lượng là bắt buộc",
                min: 1,
              })}
              id="quantity"
              type="number"
              placeholder="Nhập số lượng cho voucher."
              className="input input-bordered w-full text-black"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn bg-white border-green text-black hover:border-green hover:bg-slate-100"
            >
              Trở lại
            </button>
            <button
              type="submit"
              className="btn bg-green border-none text-white hover:bg-green hover:opacity-80"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuantityModal;
