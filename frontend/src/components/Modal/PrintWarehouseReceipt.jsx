/* eslint-disable react/prop-types */
import React from "react";

const PrintWarehouseReceipt = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-96 shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Xác nhận in phiếu nhập kho
        </h3>
        <p className="text-gray-600 mb-6">
          Bạn có muốn in phiếu nhập kho cho sản phẩm vừa thêm không?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green text-white rounded hover:bg-green-600"
          >
            In phiếu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintWarehouseReceipt;
