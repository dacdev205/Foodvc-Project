import React, { useState, useEffect } from "react";
import useOrders from "../../hooks/useOrders";
import {
  Tabs,
  Tab,
  Box,
  Modal,
  Button,
  MenuItem,
  Select,
  Pagination,
  CircularProgress,
} from "@mui/material";
import FormattedPrice from "../../ultis/FormatedPriece";
import axios from "axios";
import ghnAPI from "../../api/ghnAPI";
import { Bounce, toast } from "react-toastify";
import WarningModal from "../../components/Modal/WarningModal";
import orderAPI from "../../api/orderAPI";
import orderRequestAPI from "../../api/orderRequest";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("orderCode");
  const [page, setPage] = useState(1);
  const [value, setValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [shopData, setShopData] = useState();
  const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [orderDetailGHN, setOrderDetailGHN] = useState();
  const [orders, totalPages, refetch] = useOrders(
    searchTerm,
    filterType,
    page,
    2
  );

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [searchTerm, filterType, page, value, refetch]);

  const handleChange = (event, newValue) => setValue(newValue);

  const fetchShopData = async () => {
    try {
      const res = await ghnAPI.getAddressFOODVC();
      setShopData(res.data.shops[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrderData = async () => {
    if (!selectedOrder) return;
    try {
      const res = await ghnAPI.getOrderDetailGHN({
        client_order_code: selectedOrder.orderCode,
      });
      setOrderDetailGHN(res.data.order_code);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [selectedOrder]);

  useEffect(() => {
    fetchOrderData();
  });
  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    refetch();
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };
  const handleOrderClick = (orderId) => {
    navigate(`/user/orders/${orderId}`);
  };
  const handleCancel = async () => {
    const orderId = selectedOrder._id;
    try {
      if (selectedOrder.statusId.name === "Waiting4Pickup") {
        const payload = {
          orderId: orderId,
          userId: selectedOrder.userId,
          reason: cancelReason,
        };
        const res = await orderRequestAPI.createReq(payload);

        const orderRequestId = res._id;
        await orderAPI.addOrderRequest(orderId, orderRequestId);
        await ghnAPI.cancelOrder(
          { order_codes: [orderDetailGHN] },
          {
            headers: {
              ShopId: shopData?._id,
            },
          }
        );
        toast.success("Yêu cầu hủy đơn hàng đã được gửi thành công.", {
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
      } else {
        proceedWithCancellation();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng.", {
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

    refetch();
    setIsModalOpen(false);
    setCancelReason("");
  };

  const proceedWithCancellation = async () => {
    try {
      const payload = {
        orderId: selectedOrder._id,
        reason: cancelReason,
      };
      const res = await orderAPI.cancelOrder(payload.orderId, payload.reason);

      const orderRequestId = res.request._id;

      await orderAPI.addOrderRequest(payload.orderId, orderRequestId);
      await ghnAPI.cancelOrder(
        { order_codes: [orderDetailGHN] },
        {
          headers: {
            ShopId: shopData?._id,
          },
        }
      );
      if (res.showWarning) {
        setWarningMessage(res.warningMessage);
        setIsModalCancelOpen(true);
      } else {
        toast.success("Đơn hàng được hủy thành công!", {
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

        refetch();
        setCancelReason("");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng.", {
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
  const getOrderStatusMessage = (order) => {
    if (order.orderRequestId.length === 0) {
      return (
        <Button
          variant="outlined"
          color="error"
          onClick={() => openCancelModal(order)}
        >
          Hủy đơn
        </Button>
      );
    }
    const handleOrderClick = (orderId) => {
      navigate(`/user/orders/${orderId}`);
    };
    const orderRequestStatus = order.orderRequestId[0]?.status;
    if (orderRequestStatus === "Pending") {
      return <p>Yêu cầu của bạn đang được xử lý.</p>;
    } else if (orderRequestStatus === "Rejected") {
      return <p>Yêu cầu của bạn đã bị từ chối.</p>;
    }

    return null;
  };

  const renderOrderActions = (order) => {
    if (
      order.statusId.name === "Pending" ||
      order.statusId.name === "Waiting4Pickup"
    ) {
      return getOrderStatusMessage(order);
    }
    return null;
  };

  const filteredOrders = orders.filter((order) => {
    const statusFilter = {
      0: true,
      1: order.statusId.name === "Pending",
      2: order.statusId.name === "Waiting4Pickup",
      3: order.statusId.name === "InTransit",
      4: order.statusId.name === "Delivery",
      5: order.statusId.name === "Completed",
      6: order.statusId.name === "Cancelled",
      7: order.statusId.name === "ReturnedRefunded",
    };
    return (
      statusFilter[value] &&
      order.orderCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <div className="w-[1100px] bg-white shadow-lg">
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
              "& .MuiTabs-indicator": { backgroundColor: "green" },
              "& .MuiTab-root": { color: "black" },
              "& .MuiTab-root.Mui-selected": { color: "green" },
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

        <div className="p-3">
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
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <CircularProgress color="success" />
            </div>
          ) : orders.length ? (
            filteredOrders.map((order, index) => (
              <div key={order._id} className="mb-6 cursor-pointer  ">
                <div className="overflow-x-auto border-b border-gray-200 pb-4 ">
                  <div className="mb-2 flex justify-between ">
                    <p className="text-sm text-gray-600">
                      Trạng thái:{" "}
                      <span className="font-medium text-red-500">
                        {order.statusId.description}
                      </span>
                    </p>

                    <span> {renderOrderActions(order)}</span>
                  </div>
                  {order.products.map((product, productIndex) => (
                    <div
                      key={productIndex}
                      onClick={() => handleOrderClick(order._id)}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div className="flex items-center">
                        <img
                          src={`http://localhost:3000/${product.productId.image}`}
                          alt={product.productId.name}
                          className="w-20 h-20 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <p className="font-semibold text-lg text-black">
                            {product.productId.name}
                          </p>
                          <p className="text-black">x{product.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="text-right">
                    Tổng đơn hàng: <FormattedPrice price={order.totalAmount} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-screen flex justify-center items-center">
              <p className="text-lg text-gray-600">
                Không tìm thấy đơn hàng nào.
              </p>
            </div>
          )}
        </div>
      </div>
      <Pagination
        className="flex justify-center mt-4"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="success"
      />

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Bạn có chắc muốn hủy đơn hàng này?
          </h2>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do hủy đơn hàng..."
            className="w-full p-3 border rounded-md mb-4 text-black"
          />
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} variant="contained" color="error">
              Hủy đơn
            </Button>

            <Button onClick={() => setIsModalOpen(false)} variant="contained">
              Đóng
            </Button>
          </div>
        </Box>
      </Modal>
      <>
        <WarningModal
          open={isModalCancelOpen}
          onClose={() => setIsModalCancelOpen(false)}
          onConfirm={() => {
            setIsModalCancelOpen(false);
          }}
          message={warningMessage}
        />
      </>
    </div>
  );
};

export default UserOrders;
