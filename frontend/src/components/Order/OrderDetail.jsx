import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderAPI from "../../api/orderAPI";
import FormattedPrice from "../../ultis/FormatedPriece";

import {
  Card,
  CardContent,
  Button,
  Modal,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { MdOutlineReceiptLong } from "react-icons/md";
import ghnAPI from "../../api/ghnAPI";
import useUserCurrent from "../../hooks/useUserCurrent";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetailGHN, setOrderDetailGHN] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const PRINT_URL = import.meta.env.VITE_PRINT_URL;
  const userData = useUserCurrent();
  const isAdmin = userData?.roles.some((role) => role?.name?.includes("admin"));

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      try {
        const response = await orderAPI.getOrderById(id);
        setOrder(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

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

  useEffect(() => {
    const fetchOrderData = async () => {
      const token = order.shopId.shop_token_ghn;
      if (!token) return;
      try {
        const res = await ghnAPI.getOrderDetailGHN({
          Token: token,
          client_order_code: order?.orderCode,
        });
        setOrderDetailGHN(res.data.order_code);
      } catch (error) {
        console.log(error);
      }
    };
    if (order) {
      fetchOrderData();
    }
  }, [order, orderDetailGHN]);

  const handlePrintBill = async (format) => {
    if (!order) return;
    const token = order.shopId.shop_token_ghn;
    if (!token) return;
    try {
      const token2PrintBill = await ghnAPI.printBillGHN(
        [orderDetailGHN],
        token
      );
      const printToken = token2PrintBill.data.token;
      let printUrl = "";

      switch (format) {
        case "A5":
        case "80x80":
        case "50x72":
          printUrl = `${PRINT_URL}${printToken}`;
          break;
        default:
          return;
      }

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.src = printUrl;

      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };

      document.body.appendChild(iframe);
    } catch (error) {
      console.log("Failed to get print token:", error.message);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <CircularProgress color="success" />
      </div>
    );
  return (
    <div className="flex justify-center items-center min-h-screen">
      {order && (
        <Card className="w-full max-w-3xl shadow-lg">
          <CardContent className="p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">
                Chi tiết đơn hàng
              </h2>
              {!isAdmin && (
                <Button
                  onClick={handleOpenModal}
                  variant="contained"
                  startIcon={<MdOutlineReceiptLong />}
                  className="bg-green-600 hover:bg-green-500 text-white"
                >
                  In vận đơn
                </Button>
              )}
            </div>
            {/* Thông tin đơn hàng */}
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Họ và tên:</strong> {order.addressId.fullName}
              </p>
              <p className="text-gray-700">
                <strong>Số điện thoại:</strong> {order.addressId.phone}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {order.userId.email}
              </p>
              <p className="text-gray-700">
                <strong>Mã đơn hàng:</strong> {order.orderCode}
              </p>
              <p className="text-gray-700">
                <strong>Tổng tiền hàng:</strong>{" "}
                <FormattedPrice price={order.totalProductAmount} />
              </p>{" "}
              <p className="text-gray-700">
                <strong>Phí vận chuyễn:</strong>{" "}
                <FormattedPrice price={order.shippingFee} />
              </p>
              <p className="text-gray-700">
                <strong>Tổng cộng:</strong>{" "}
                <FormattedPrice price={order.totalAmount} />
              </p>
              <p className="text-gray-700">
                <strong>Phương thức thanh toán:</strong> {order.methodId.name}
              </p>
              <p className="text-gray-700">
                <strong>Ngày đặt hàng:</strong>{" "}
                {formatDateTime(order.createdAt)}
              </p>
              <p className="text-gray-700">
                <strong>Địa chỉ:</strong> {order.addressId.street},{" "}
                {order.addressId.ward.wardName},{" "}
                {order.addressId.district.districtName},{" "}
                {order.addressId.city.cityName}
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Lưu ý:
                </h3>
                <p className="text-gray-600">
                  <strong>Lời nhắn:</strong> {order.note || "Không có"}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sản phẩm:
                </h3>
                <div className="space-y-4">
                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <p className="text-gray-700">
                        <strong>Tên:</strong> {product.productId?.name}
                      </p>
                      <p className="text-gray-700">
                        <strong>Phân loại:</strong>{" "}
                        {product.productId?.category?.name}
                      </p>
                      <p className="text-gray-700">
                        <strong>Số lượng:</strong> {product.quantity}
                      </p>
                      <p className="text-gray-700">
                        <strong>Giá:</strong>{" "}
                        <FormattedPrice price={product.productId?.price} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal chọn định dạng in */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            In vận đơn cho mã đơn hàng{" "}
            <span className="text-green">{orderDetailGHN}</span>
          </Typography>
          <Typography
            id="modal-title"
            sx={{
              textAlign: "center",
              mt: 2,
              fontStyle: "italic",
              color: "gray",
            }}
          >
            Lưu ý: khổ 52 x 70 mm và khổ 80 x 80 mm chỉ dành cho máy in nhiệt,
            in và dán trực tiếp lên món hàng
          </Typography>
          <div className="flex mt-4 space-x-3">
            <Button
              variant="contained"
              onClick={() => {
                handlePrintBill("A5");
                handleCloseModal();
              }}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              In khổ A5
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handlePrintBill("80x80");
                handleCloseModal();
              }}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              In khổ 80x80
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handlePrintBill("50x72");
                handleCloseModal();
              }}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              In khổ 50x72
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default OrderDetail;
