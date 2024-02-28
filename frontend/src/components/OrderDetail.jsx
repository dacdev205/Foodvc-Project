import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderAPI from "../api/orderAPI";
import FormattedPrice from "./FormatedPriece";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
    const capture = document.querySelectorAll(".invoice");
    if (capture.length > 0) {
      html2canvas(capture[0]).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const doc = new jsPDF("p", "mm", "a4");
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, "PNG", 0, 0, width, height);
        doc.save("bill.pdf");
      });
    } else {
      console.error("Không tìm thấy phần tử để chụp.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {order && (
        <div className="rounded px-8 pt-6 pb-8 mb-4">
          <div className="bg-white">
            <h2 className="text-2xl font-semibold mb-4 invoice">
              Chi tiết đơn hàng
            </h2>
            <p>
              <span className="font-semibold">Họ và tên:</span>{" "}
              {order.address.fullName}
            </p>
            <p>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {order.address.phone}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {order.email}
            </p>
            <p>
              <span className="font-semibold">Mã đơn hàng:</span>{" "}
              {order.orderCode}
            </p>
            <p>
              <span className="font-semibold">Tổng cộng:</span>{" "}
              <FormattedPrice price={order.totalAmount} />
            </p>
            <p>
              <span className="font-semibold">Ngày đặt hàng:</span>{" "}
              {formatDateTime(order.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {order.address.street}, {order.address.city},{" "}
              {order.address.district}, {order.address.ward}
            </p>
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">Sản phẩm:</h3>
              {order.products.map((product, index) => (
                <div key={index}>
                  <p>
                    <span className="font-semibold">Tên:</span> {product.name}
                  </p>
                  <p>
                    <span className="font-semibold">Phân loại:</span>{" "}
                    {product.category}
                  </p>
                  <p>
                    <span className="font-semibold">Số lượng:</span>{" "}
                    {product.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Giá:</span>{" "}
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
