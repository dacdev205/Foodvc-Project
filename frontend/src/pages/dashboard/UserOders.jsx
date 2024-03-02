import React, { useEffect, useState } from "react";
import FormattedPrice from "../../components/FormatedPriece";
import { Link } from "react-router-dom";
const PF = "https://foodvc-server.onrender.com";
import useOrders from "../../hooks/useOrders";
const UserOders = () => {
  const [orders, refetch, isLoading] = useOrders();

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("vi-VN", options);
  };
  const displayStatus = (status) => {
    if (status === "Confirmed") {
      return "Đã xác nhận";
    } else if (status === "Pending") {
      return "Chờ xác nhận";
    } else if (status === "In Transit") {
      return "Đang giao hàng";
    } else if (status === "Delivered") {
      return "Đã giao hàng";
    }
    return status;
  };
  return (
    <div className="section-container">
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-24 flex flex-col items-center justify-center">
          {/* content */}
          <div className=" text-center px-4 space-y-7">
            {orders.length ? (
              <h2 className="md:text-3xl text-2xl font-bold md:leading-snug leading-snug text-black">
                Đơn hàng <span className="text-green">đã đặt</span>
              </h2>
            ) : (
              <div>
                <h2 className="md:text-2xl text-1xl font-bold md:leading-snug leading-snug text-black">
                  Chưa có đơn nào <span className="text-green">đã đặt</span>
                </h2>
                <div>
                  <Link to="/menu">
                    <button className="btn bg-green text-white">
                      Tiếp tục mua sắm
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {orders.length ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table text-center">
              {/* head */}
              <thead className="bg-green text-white rounded-sm">
                <tr>
                  <th>#</th>
                  <th>Ngày đặt hàng</th>
                  <th>Mã đơn hàng</th>
                  <th>Tổng đơn hàng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {orders.map((order, index) => (
                  <tr key={index} className="text-black">
                    <td>{index + 1}</td>
                    <td>{formatDateTime(order.createdAt)}</td>
                    <td>
                      <div className="">{order.orderCode}</div>
                    </td>
                    <td>
                      <FormattedPrice price={order.totalAmount} />
                    </td>
                    <td>{displayStatus(order.status)}</td>
                    <td>
                      <button className="btn">Liên hệ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserOders;
