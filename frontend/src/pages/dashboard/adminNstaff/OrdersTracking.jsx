import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderAPI from "../../../api/orderAPI";
import Pagination from "../../../ultis/Pagination";
import { FaEye } from "react-icons/fa";
import FormattedPrice from "../../../ultis/FormatedPriece";

const OrdersTracking = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const response = await orderAPI.getAllOrder();
        setAllOrders(response);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchAllOrders();
  }, []);
  useEffect(() => {
    const fetchStatuses = async () => {
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
  }, []);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = async (orderId, newStatusId) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatusId);
      const updatedOrders = await orderAPI.getAllOrder();
      setAllOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await orderAPI.updateOrderStatus(orderId, "Cancelled");
      const updatedOrders = await orderAPI.getAllOrder();
      setAllOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChangeSearch = (e) => {
    setSearchStatus(e.target.value);
  };

  const filteredOrders = allOrders.filter((order) => {
    return (
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchStatus === "" || order.status.name === searchStatus)
    );
  });

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <div>
        <h2 className="text-2xl font-semibold my-4 text-black">
          Quản lý tất cả <span className="text-green">đơn hàng</span>
        </h2>
        <h5 className="text-black">Tổng số đơn hàng: {allOrders.length}</h5>
      </div>
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
          <option value="Pending">Chờ xác nhận</option>
          <option value="Waiting4Pickup">Chờ lấy hàng</option>
          <option value="InTransit">Vận chuyển</option>
          <option value="Delivery">Chờ giao hàng</option>
          <option value="Completed">Hoàn thành</option>
          <option value="Cancelled">Đã hủy</option>
          <option value="ReturnedRefunded">Trả hàng/Hoàn tiền</option>
        </select>
      </div>
      {allOrders.length ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-green text-white rounded-sm">
                <tr className="border-style">
                  <th>#</th>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt hàng</th>
                  <th>Tổng đơn hàng</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
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
                      {order.statusId.name === "Pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="ml-2 text-red-500"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredOrders.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      ) : (
        <p className="text-center text-black">Không có đơn hàng nào.</p>
      )}
    </div>
  );
};

export default OrdersTracking;
