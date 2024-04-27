import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderAPI from "../../../api/orderAPI";
import Pagination from "../../../ultis/Pagination";
const OrdersTracking = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  useEffect(() => {
    const fetchAllOrders = async () => {
      const response = await orderAPI.getAllOrder();
      console.log(response);
      setAllOrders(response);
    };

    fetchAllOrders();
  }, []);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      const updatedOrders = await orderAPI.getAllOrder();
      setAllOrders(updatedOrders);
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
  const filteredOrders = allOrders.filter((order) => {
    return (
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchStatus === "" || order.status === searchStatus)
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
          className="border p-2 rounded-md mr-2 text-black"
        />
        <select value={searchStatus} onChange={handleStatusChangeSearch}>
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Đang xử lý</option>
          <option value="Confirmed">Đã xác nhận</option>
          <option value="In Transit">Đang giao hàng</option>
          <option value="Delivered">Đã nhận hàng</option>
        </select>
      </div>
      {allOrders.length ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead className="bg-green text-white rounded-sm">
                <tr className="border-style">
                  <th>#</th>
                  <th>Mã đơn hàng</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {currentOrders.map((order, index) => (
                  <tr key={index} className="text-black border-gray-300">
                    <td>{index + 1}</td>
                    <td>
                      <div className="">{order.orderCode}</div>
                    </td>

                    <td>
                      <select
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Đang xử lý</option>
                        <option value="Confirmed">Đã xác nhận</option>
                        <option value="In Transit">Đang giao hàng</option>
                        <option value="Delivered">Đã nhận hàng</option>
                      </select>
                    </td>
                    <td>
                      <Link to={`${order._id}`}>Xem chi tiết</Link>
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
        ""
      )}
    </div>
  );
};

export default OrdersTracking;
