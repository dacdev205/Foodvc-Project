import React, { useState, useEffect } from "react";
import voucherAPI from "../../../api/voucherAPI";
// import { format } from "date-fns";
import AddVoucherModal from "../../../components/AddVoucherModal";

const AddVoucher = () => {
  const PF = "http://localhost:3000";

  const [voucher, setVoucher] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchVoucherList = async () => {
      try {
        const data = await voucherAPI.getAllVoucher();
        setVoucher(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVoucherList();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("vi-VN", options);
  };
  return (
    <div className="w-full px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý khuyến mãi <span className="text-green">sản phẩm</span>
      </h2>
      <div>
        <div className="flex items-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-ghost bg-green text-white ml-10 hover:bg-green hover:opacity-80"
          >
            Thêm mới Voucher
          </button>
          <AddVoucherModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-black border-style">
                <th>#</th>
                <th>Stt</th>
                <th className="cursor">Mã voucher</th>
                <th className="cursor">Mô tả voucher</th>
                <th>Trạng thái</th>
                <th>% Giảm</th>
                <th>Ngày hết hạn</th>
                <th className="text-center">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {voucher.map((item, index) => (
                <tr key={index} className="text-black border-gray-300">
                  <td>
                    <label
                      htmlFor={`checkbox-${item._id}`}
                      className="cursor-pointer relative"
                    >
                      <input
                        type="checkbox"
                        className="appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      />
                    </label>
                  </td>
                  <th>{index + 1}</th>
                  <td>{item.code}</td>
                  <td>{item.voucher_describe.slice(0, 20)}...</td>
                  <td>{item.status ? "Hoạt động" : "Không hoạt động"}</td>
                  <td className="text-center">
                    {item.voucher_discount_persent} %
                  </td>
                  <td>{formatDateTime(item.voucher_experied_date)}</td>
                  <td className="text-center">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddVoucher;
