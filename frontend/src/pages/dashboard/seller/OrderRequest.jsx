import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import { Bounce, toast } from "react-toastify";
import orderRequestAPI from "../../../api/orderRequest";
import Pagination from "@mui/material/Pagination";
import { CircularProgress } from "@mui/material";

const ManageOrderRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async (searchTerm, page, limit) => {
    setLoading(true);
    try {
      const response = await orderRequestAPI.getAllCancelReq(
        searchTerm,
        page,
        limit
      );
      if (response && response.requests) {
        setOrders(response.requests);
        setTotalPages(response.totalPages);
      } else {
        setOrders([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(searchTerm, page, limit);
  }, [searchTerm, page, limit]);

  const handleDeleteOrder = async (orderId) => {
    try {
      await axiosSecure.delete(`/order-request/cancel-request/${orderId}`);
      toast.success("Đơn hàng đã được xóa", {
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
      setOrders(orders.filter((order) => order._id !== orderId));
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Đã xảy ra lỗi khi xóa đơn hàng", {
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
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="w-full md:w-[900px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">yêu cầu đơn hàng</span>
      </h2>
      <div className="flex items-center my-2">
        <label htmlFor="search" className="mr-2 text-black">
          Tìm kiếm:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên khách hàng"
          value={searchTerm}
          onChange={handleSearch}
          className="input input-sm text-black"
        />
      </div>
      <div>
        <table className="table shadow-lg">
          <thead className="bg-green text-white rounded-lg">
            <tr className="border-style">
              <th>#</th>
              <th>Mã đơn hàng</th>
              <th>Tên khách hàng</th>
              <th>Yêu cầu</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Chi tiết</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order, index) => (
                <tr key={index}>
                  <th className="text-black">{index + 1}</th>
                  <td className="text-black">{order.orderId?.orderCode}</td>
                  <td className="text-black">{order.userId.name}</td>
                  <td className="text-black">
                    {order.requestType === "Cancel"
                      ? "Hủy đơn"
                      : order.requestType === "Return"
                      ? "Trả hàng"
                      : order.requestType}
                  </td>
                  <td className="text-black">
                    {order.status === "Pending"
                      ? "Đang chờ xử lý"
                      : order.status === "Approved"
                      ? "Chấp thuận"
                      : order.status === "Rejected"
                      ? "Loại bỏ yêu cầu"
                      : order.status}
                  </td>
                  <td className="text-black">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    <Link to={`/seller/edit-order/${order._id}`}>
                      <button className="btn btn-ghost btn-xs text-blue-500">
                        <FaEye />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setOrderToDelete(order._id);
                        setShowConfirmModal(true);
                      }}
                      className="btn btn-ghost btn-xs text-red"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  Không có yêu cầu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ConfirmDeleteModal
          showModal={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => handleDeleteOrder(orderToDelete)}
          title="Xác nhận xóa yêu cầu"
          message="Bạn có chắc chắn muốn xóa yêu cầu này?"
        />
      </div>
      {orders.length > 0 && (
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

export default ManageOrderRequests;
