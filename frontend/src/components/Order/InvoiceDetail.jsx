/* eslint-disable react/prop-types */
import React from "react";
import Barcode from "react-barcode";
import FormattedPrice from "./FormatedPriece";

const InvoiceDetail = ({ invoice }) => {
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

  return (
    <div>
      <p>
        <span className="font-semibold">Họ và tên:</span>{" "}
        {invoice.address.fullName}
      </p>
      <p>
        <span className="font-semibold">Số điện thoại:</span>{" "}
        {invoice.address.phone}
      </p>
      <p>
        <span className="font-semibold">Email:</span> {invoice.email}
      </p>
      <p>
        <span className="font-semibold">Tổng cộng:</span>{" "}
        <FormattedPrice price={invoice.totalAmount} />
      </p>
      <span className="font-semibold">Ngày đặt hàng:</span>{" "}
      {formatDateTime(invoice.createdAt)}
      <p>
        <span className="font-semibold">Email:</span> {invoice.email}
      </p>
      <p>
        <span className="font-semibold">Địa chỉ:</span> {invoice.address.street}
        , {invoice.address.city}, {invoice.address.district},{" "}
        {invoice.address.ward}
      </p>
      <Barcode value={invoice.orderCode} />
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Sản phẩm:</h3>
        {invoice.products.map((product, index) => (
          <div key={index} className="border-b border-gray-200 py-2">
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
            <p className="flex">
              <span className="font-semibold">Giá:</span>
              <FormattedPrice price={product.price} />
            </p>
          </div>
        ))}
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Tải hóa đơn
      </button>
    </div>
  );
};

export default InvoiceDetail;
