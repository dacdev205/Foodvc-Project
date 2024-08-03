import React, { useState, useEffect } from "react";
import useOrders from "../../hooks/useOrders";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FormattedPrice from "../../ultis/FormatedPriece";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const UserOrders = () => {
  const [orders, refetch, isLoading] = useOrders();
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [productDetails, setProductDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    // Xử lý logic hủy đơn hàng với lý do cancelReason và đơn hàng selectedOrder
    console.log("Hủy đơn hàng:", selectedOrder, "Lý do:", cancelReason);
    setIsModalOpen(false);
    setCancelReason("");
  };

  useEffect(() => {
    if (orders.length) {
      const products = orders.flatMap((order) =>
        order.products.map((product) => ({
          orderCode: order.orderCode,
          ...product,
        }))
      );
      setProductDetails(products);
    }
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
    <div className="w-[1100px] bg-white shadow-lg">
      {orders.length ? (
        <div className="p-3">
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
            <div className="my-2 flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng"
                value={searchTerm}
                onChange={handleSearchChange}
                className="border p-2 rounded-md mr-2 text-black input-sm"
              />
            </div>
          )}
          {filteredOrders.map((order, index) => (
            <div key={index} className="mb-6">
              <div className="overflow-x-auto border-b border-gray-200 pb-4">
                <div className="mb-2 flex justify-between">
                  <p className="text-sm text-gray-600">
                    Trạng thái:{" "}
                    <span className="font-medium text-red-500">
                      {displayStatus(order.status)}
                    </span>
                  </p>
                  {order.status === "Pending" && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => openCancelModal(order)}
                    >
                      Hủy đơn
                    </Button>
                  )}
                </div>
                <React.Fragment>
                  {order.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:3000/${product.image}`}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <p className="font-semibold text-lg text-black">
                            {product.name}
                          </p>
                          <p className="text-black">x{product.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <FormattedPrice price={product.price} />
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <p className="text-lg text-gray-600">Chưa có đơn hàng nào.</p>
        </div>
      )}

      {/* Modal for canceling order */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="cancel-order-modal"
        aria-describedby="cancel-order-description"
      >
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4" id="cancel-order-modal">
              Chọn lý do hủy đơn
            </h2>
            <Select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              displayEmpty
              className="w-full mb-4"
            >
              <MenuItem value="" disabled>
                Chọn lý do
              </MenuItem>
              <MenuItem value="Reason1">Lý do 1</MenuItem>
              <MenuItem value="Reason2">Lý do 2</MenuItem>
              <MenuItem value="Reason3">Lý do 3</MenuItem>
              <MenuItem value="Reason4">Lý do 4</MenuItem>
            </Select>
            <div className="flex justify-end">
              <Button
                variant="contained"
                color="error"
                onClick={handleCancel}
                disabled={!cancelReason}
              >
                Hủy đơn
              </Button>
              <Button
                variant="outlined"
                onClick={() => setIsModalOpen(false)}
                className="ml-2"
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserOrders;
