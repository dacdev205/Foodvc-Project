/* eslint-disable react/prop-types */
import React from "react";

const PaymentMethodModal = ({
  isOpen,
  onClose,
  paymentMethods,
  onSelectMethod,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          <span className="text-2xl">&times;</span>
        </button>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Chọn hình thức thanh toán
          </h3>
          <div className="mt-4 space-y-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                className="btn w-full bg-green text-white hover:bg-green hover:opacity-80"
                onClick={() => onSelectMethod(method)}
              >
                {method.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
