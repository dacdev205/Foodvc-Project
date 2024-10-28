import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderAPI from "../../../api/orderAPI";
import { FaEye } from "react-icons/fa";
import FormattedPrice from "../../../ultis/FormatedPriece";
import { Bounce, toast } from "react-toastify";
import { CircularProgress, Pagination } from "@mui/material";
import useUserCurrent from "../../../hooks/useUserCurrent";

const OrdersTracking = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];

  useEffect(() => {
    if (!shopId) {
      return;
    }

    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const response = await orderAPI.getAllOrder(
          searchTerm,
          searchStatus,
          page,
          5,
          shopId
        );
        setTotalPages(response.totalPages);
        setAllOrders(response.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [searchTerm, searchStatus, page, shopId]);

  useEffect(() => {
    if (!shopId) {
      return;
    }

    const fetchStatuses = async () => {
      setLoading(true);
      try {
        const response = await orderAPI.getAllStatuses();
        setStatuses(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatuses();
  }, [shopId]);

  const handleStatusChange = async (orderId, newStatusId) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatusId);
      const updatedOrders = await orderAPI.getAllOrder(
        searchTerm,
        searchStatus,
        page,
        5,
        shopId
      );
      setAllOrders(updatedOrders.orders);
      toast.success("Trạng thái đã được cập nhật", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChangeSearch = (e) => {
    setSearchStatus(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="w-full md:w-[980px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">đơn hàng</span>
      </h2>
      <h5 className="text-black">Tổng số đơn hàng: {allOrders.length}</h5>
      <div className="my-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded-md mr-2 text-black input-sm"
        />
        <select
          value={searchStatus}
          onChange={handleStatusChangeSearch}
          className="select select-sm"
        >
          <option value="">Tất cả trạng thái</option>
          {statuses.map((status) => (
            <option key={status._id} value={status._id}>
              {status.description}
            </option>
          ))}
        </select>
      </div>
      <div>
        <table className="table shadow-lg rounded-lg">
          <thead className="bg-green text-white">
            <tr className="border-style">
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Ngày đặt hàng</th>
              <th>Tổng đơn hàng</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : allOrders.length ? (
              allOrders.map((order, index) => (
                <tr key={index} className="text-black border-gray-300">
                  <td>{index + 1}</td>
                  <td>{order.orderCode}</td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <FormattedPrice price={order.totalAmount} />
                  </td>
                  <td>
                    {order.paymentStatus === true
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </td>
                  <td>
                    <select
                      value={order.statusId._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={order.statusId.name === "Cancelled"}
                    >
                      {statuses.map((status) => (
                        <option key={status._id} value={status._id}>
                          {status.description}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center">
                    <button>
                      <Link to={`${order._id}`} className="text-blue-500">
                        <FaEye />
                      </Link>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-black">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {allOrders.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      )}
    </div>
  );
};

export default OrdersTracking;
