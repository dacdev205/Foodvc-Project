import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import orderAPI from "../../api/orderAPI";
import { CircularProgress } from "@mui/material";
import { FaInfoCircle, FaUser, FaShippingFast } from "react-icons/fa";

const UserOrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const PF = "http://localhost:3000";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await orderAPI.getOrderById(orderId);
        console.log(data);
        setOrderDetail(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex">
      {orderDetail ? (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Chi tiết đơn hàng
          </h1>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-gray-600" /> Thông tin đơn hàng
            </h2>
            <div className="flex justify-between mb-2">
              <p className="mr-10">
                <strong>Mã đơn hàng:</strong> {orderDetail.orderCode}
              </p>
              <p>
                <strong>Ghi chú:</strong>{" "}
                {orderDetail.note || "Không có ghi chú"}
              </p>
            </div>
            <div className="flex justify-between mb-2">
              <p>
                <strong>Tổng số tiền:</strong>{" "}
                {orderDetail.totalAmount.toLocaleString()} VND
              </p>
              <p>
                <strong>Trạng thái thanh toán:</strong>{" "}
                <span
                  className={`font-medium ${
                    orderDetail.paymentStatus
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {orderDetail.paymentStatus
                    ? "Đã thanh toán"
                    : "Chưa thanh toán"}
                </span>
              </p>
            </div>
          </div>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaUser className="mr-2 text-gray-600" /> Thông tin người dùng
            </h2>
            <div className="flex justify-between mb-2">
              <p>
                <strong>Tên người dùng:</strong> {orderDetail.userId.name}
              </p>
              <p>
                <strong>Email:</strong> {orderDetail.userId.email}
              </p>
            </div>
          </div>

          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaShippingFast className="mr-2 text-gray-600" /> Địa chỉ giao
              hàng
            </h2>
            <div className="flex justify-between mb-2">
              <p>
                <strong>Địa chỉ:</strong> {orderDetail.addressId.street}
              </p>
              <p>
                <strong>Thành phố:</strong>{" "}
                {orderDetail.addressId.city.cityName}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Sản phẩm trong đơn hàng
            </h2>
            <ul className="space-y-4">
              {orderDetail.products.map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 ease-in-out mb-2 cursor-pointer"
                  onClick={() => handleProductClick(product.productId._id)}
                >
                  <div className="flex items-center">
                    <img
                      src={
                        PF + "/" + product.productId.image ||
                        "https://via.placeholder.com/150"
                      }
                      alt={product.productId.name}
                      className="w-16 h-16 object-cover rounded-md mr-4"
                    />
                    <div>
                      <p className="font-medium">{product.productId.name}</p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {product.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {(
                      product.productId.price * product.quantity
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[400px] w-[1100px]">
          <CircularProgress color="success" />
        </div>
      )}
    </div>
  );
};

export default UserOrderDetail;
