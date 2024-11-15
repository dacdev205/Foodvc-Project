/* eslint-disable react/prop-types */
import React from "react";
import FormattedPrice from "../../ultis/FormatedPriece";

const CommissionPolicyModal = ({ isOpen, onClose, policies }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-1/2">
        <h2 className="text-xl font-semibold mb-4">Chính sách hoa hồng</h2>
        {policies?.length === 0 ? (
          <p>Chưa có chính sách hoa hồng hiện tại.</p>
        ) : (
          <ul>
            {policies?.map((policy, index) => (
              <li key={index} className="mb-2">
                <strong>{policy?.name}</strong>:
                <div>
                  <p> - {policy?.description}</p>
                  <p> - Phí hoa hồng: {policy?.commissionRate}%</p>
                  <p>
                    {" "}
                    - Doanh thu tối thiểu:{" "}
                    <FormattedPrice
                      price={policy?.revenueRequired}
                    ></FormattedPrice>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="underline italic text-gray-500">
          Vì bạn là người mới chúng tôi sẽ xếp bạn vào hạng mục Bán lẻ lúc tạo
          cửa hàng.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            className="btn bg-green hover:bg-green hover:opacity-80 text-white"
            onClick={onClose}
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommissionPolicyModal;
