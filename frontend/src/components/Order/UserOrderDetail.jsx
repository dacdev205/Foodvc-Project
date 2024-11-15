import React, { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useOutletContext,
  Link,
} from "react-router-dom";
import orderAPI from "../../api/orderAPI";
import conversationAPI from "../../api/conversationAPI";
import { CircularProgress } from "@mui/material";
import { FaInfoCircle, FaUser, FaShippingFast } from "react-icons/fa";
import useUserCurrent from "../../hooks/useUserCurrent";
import shopAPI from "../../api/shopAPI";
import { CiShop } from "react-icons/ci";
import FormattedPrice from "../../ultis/FormatedPriece";

const UserOrderDetail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const PF = "http://localhost:3000";
  const navigate = useNavigate();
  const context = useOutletContext();
  const [shopId, setShopId] = useState(null);
  const toggleContactAdmin = context ? context.toggleContactAdmin : () => {};
  const userData = useUserCurrent();
  const [shopDetail, setShopDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const data = await orderAPI.getOrderById(orderId);
        setShopId(data.products[0].shopId);
        setOrderDetail(data);
        if (data.products[0].shopId) {
          const shopData = await shopAPI.getShop(data.products[0].shopId);

          setShopDetail(shopData.shop);
        }
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

  const handleContactSeller = async () => {
    const senderId = userData._id;
    const receiverId = shopId;

    try {
      const conversations = await conversationAPI.getConversationsByUserId(
        senderId
      );

      const existingConversation = conversations.find(
        (conv) =>
          conv.members.includes(senderId) && conv.members.includes(receiverId)
      );

      if (existingConversation) {
        toggleContactAdmin();
      } else {
        await conversationAPI.createConversation({ senderId, receiverId });
        toggleContactAdmin();
      }
    } catch (error) {
      console.error("Error checking or creating conversation:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex w-[800px]">
      {orderDetail ? (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Chi tiết đơn hàng
          </h1>

          {/* Order Information Section */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaInfoCircle className="mr-2 text-gray-600" /> Thông tin đơn hàng
            </h2>
            <div className="flex justify-between mb-2">
              <p className="mr-10">
                <strong>Mã đơn hàng:</strong> {orderDetail.orderCode}
              </p>
              <div>
                <p>
                  <strong>Ghi chú:</strong>{" "}
                  {orderDetail.note || "Không có ghi chú"}
                </p>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <p>
                <strong>Phương thức thanh toán:</strong>{" "}
                {orderDetail.methodId.name}
              </p>
            </div>
            <div className=" mb-2">
              <p className="mb-2">
                <strong>Tổng tiền hàng:</strong>{" "}
                <FormattedPrice
                  price={orderDetail.totalProductAmount}
                ></FormattedPrice>
              </p>
              <p className="mb-2">
                <strong>Phí vận chuyển:</strong>{" "}
                <FormattedPrice
                  price={orderDetail.shippingFee}
                ></FormattedPrice>
              </p>
              <p className="">
                <strong>Tổng số tiền:</strong>{" "}
                <FormattedPrice
                  price={orderDetail.totalAmount}
                ></FormattedPrice>
              </p>
            </div>
          </div>

          {/* User Information Section */}
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

          {/* Shipping Address Section */}
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <FaShippingFast className="mr-2 text-gray-600" /> Địa chỉ giao
              hàng
            </h2>
            <div className="flex justify-between mb-2">
              <p>
                <strong>Địa chỉ:</strong> {orderDetail.addressId.street},
                {orderDetail.addressId.ward.wardName},{" "}
                {orderDetail.addressId.district.districtName},{" "}
                {orderDetail.addressId.city.cityName}
              </p>
            </div>
          </div>
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              Shop đã mua
            </h2>
            <div className="flex items-center mb-2">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12 mr-1">
                  {loading && <CircularProgress size={24} color="success" />}
                  <img
                    src={PF + "/" + shopDetail?.shop_image}
                    alt="product"
                    className={loading ? "hidden" : "block"}
                    onLoad={() => setLoading(false)}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  {shopDetail?.shopName}
                </h1>
                <Link
                  to={`/shop-detail/${shopDetail?._id}`}
                  className="flex items-center text-blue-400 p-2 rounded-md border-indigo-300 border"
                >
                  <CiShop />
                  Xem shop
                </Link>
              </div>
            </div>
          </div>
          {/* Products List Section */}
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
                    <FormattedPrice
                      price={product.productId.price * product.quantity}
                    ></FormattedPrice>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleContactSeller}
              className="bg-green text-white py-2 px-4 rounded shadow hover:opacity-90 transition-colors"
            >
              Liên hệ người bán
            </button>
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
