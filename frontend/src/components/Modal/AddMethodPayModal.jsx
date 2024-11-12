/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { toast } from "react-toastify";

const AddMethodPayModal = ({ open, onClose, onAddMethodPay }) => {
  const [name, setName] = useState("");
  const [methodId, setMethodId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = () => {
    if (!name) {
      toast.warn("Tên phương thức thanh toán không được bỏ trống", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }
    if (!methodId) {
      toast.warn("methodId không được bỏ trống", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    // Call the onAddMethodPay with methodId included
    onAddMethodPay({ name, methodId, isActive });
    onClose();
    setName("");
    setMethodId(""); // Clear methodId field
    setIsActive(true);
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
          Thêm phương thức thanh toán mới
        </h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên phương thức thanh toán"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Method ID"
          value={methodId}
          onChange={(e) => setMethodId(e.target.value)}
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            className="mr-2"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Kích hoạt phương thức thanh toán
        </label>
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-green text-white rounded hover:bg-green-600 mt-4"
        >
          Thêm phương thức
        </button>
      </div>
    </div>
  );
};

export default AddMethodPayModal;
