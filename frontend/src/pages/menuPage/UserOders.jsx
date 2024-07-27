import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useOrders from "../../hooks/useOrders";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FormattedPrice from "../../ultis/FormatedPriece";

const UserOrders = () => {
  const [orders, refetch, isLoading] = useOrders();
  const [value, setValue] = React.useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [productDetails, setProductDetails] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const products = orders.flatMap((order) =>
      order.products.map((product) => ({
        orderCode: order.orderCode,
        ...product,
      }))
    );
    setProductDetails(products);
  }, [orders]);

  const filteredOrders = orders.filter((order) => {
    const statusFilter = {
      0: true, // All orders
      1: order.status === "Pending",
      2: order.status === "Waiting4Pickup",
      3: order.status === "InTransit",
      4: order.status === "Delivery",
      5: order.status === "Completed",
      6: order.status === "Cancelled",
      7: order.status === "ReturnedRefunded",
    };
    return (
      statusFilter[value] &&
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
    const statusMap = {
      Confirmed: "Đã xác nhận",
      Pending: "Chờ xác nhận",
      Waiting4Pickup: "Chờ lấy hàng",
      InTransit: "Đang giao hàng",
      Delivery: "Chờ giao hàng",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy",
      ReturnedRefunded: "Trả hàng/Hoàn tiền",
    };
    return statusMap[status] || status;
  };

  return (
    <div className="">
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            {orders.length ? (
              ""
            ) : (
              <div>
                <h2 className="md:text-2xl text-1xl font-bold md:leading-snug leading-snug text-black">
                  Chưa có đơn nào <span className="text-green">đã đặt</span>
                </h2>
                <div>
                  <Link to="/menu">
                    <button className="btn bg-green text-white hover:bg-green hover:opacity-80 border-none">
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
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", width: 1100 }}
            className="mb-3"
          >
            <Tabs
              value={value}
              centered
              onChange={handleChange}
              aria-label="order tabs"
              textColor="inherit"
              indicatorColor="primary"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "green",
                },
                "& .MuiTab-root": {
                  color: "black",
                },
                "& .MuiTab-root.Mui-selected": {
                  color: "green",
                },
              }}
            >
              <Tab label="Tất cả" />
              <Tab label="Chờ xác nhận" />
              <Tab label="Chờ lấy hàng" />
              <Tab label="Vận chuyển" />
              <Tab label="Chờ giao hàng" />
              <Tab label="Hoàn thành" />
              <Tab label="Đã hủy" />
              <Tab label="Trả hàng/Hoàn tiền" />
            </Tabs>
          </Box>

          {value === 0 && (
            <div className="my-2">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border p-2 rounded-md mr-2 text-black input-sm"
              />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table text-center">
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
                {filteredOrders.map((order, index) => (
                  <React.Fragment key={index}>
                    <tr className="text-black">
                      <td>{index + 1}</td>
                      <td>{formatDateTime(order.createdAt)}</td>
                      <td>
                        <div>{order.orderCode}</div>
                      </td>
                      <td>
                        <FormattedPrice price={order.totalAmount} />
                      </td>
                      <td>{displayStatus(order.status)}</td>
                      <td>
                        <Link to="/admin-chat">
                          <button className="btn">Liên hệ</button>
                        </Link>
                      </td>
                    </tr>
                    {order.products.map((product, productIndex) => (
                      <tr key={productIndex} className="text-black">
                        <td colSpan="6" className="text-left">
                          <div className="flex items-center">
                            <img
                              src={`http://localhost:3000/${product.image}`}
                              alt={product.name}
                              className="w-20 h-20 object-cover mr-4"
                            />
                            <div>
                              <p className="font-semibold">{product.name}</p>
                              <p>
                                <FormattedPrice price={product.price} />
                              </p>
                              <p>Số lượng: {product.quantity}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
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

export default UserOrders;
