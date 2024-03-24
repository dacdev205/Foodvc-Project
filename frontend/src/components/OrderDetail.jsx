import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderAPI from "../api/orderAPI";
import FormattedPrice from "../ultis/FormatedPriece";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderAPI.getOrderById(id);
        setOrder(response);
      } catch (error) {
        console.log(error);
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

  const downloadInvoice = () => {
    if (!order) return;
  };

  return (
    <div className="section-container">
      {order && (
        <div className="rounded px-8 pt-6 pb-8 mb-4">
          <div className="bg-white text-black">
            <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
            <p>
              <strong>Họ và tên:</strong> {order.address.fullName}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {order.address.phone}
            </p>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Mã đơn hàng:</strong> {order.orderCode}
            </p>
            <p>
              <strong>Tổng cộng:</strong>{" "}
              <FormattedPrice price={order.totalAmount} />
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong> {formatDateTime(order.createdAt)}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.address.street},{" "}
              {order.address.city}, {order.address.district},{" "}
              {order.address.ward}
            </p>
            <div className="mt-3">
              <h3 className="text-xl font-semibold mb-2">Lưu ý:</h3>
              <p>
                <strong>Lời nhắn:</strong> {order.note}
              </p>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Sản phẩm:</h3>
              {order.products.map((product, index) => (
                <div key={index}>
                  <p>
                    <strong>Tên:</strong> {product.name}
                  </p>
                  <p>
                    <strong>Phân loại:</strong> {product.category}
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Giá:</strong>{" "}
                    <FormattedPrice price={product.price} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        className="font-bold py-2 px-4 rounded mt-4"
        onClick={downloadInvoice}
      >
        Tạo hóa đơn
      </button>
    </div>
  );
};

export default OrderDetail;
