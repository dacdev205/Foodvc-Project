import React, { useEffect, useState } from "react";
import orderRequestAPI from "../../api/orderRequest";
import { useNavigate, useParams } from "react-router-dom";
import { FaClipboardList, FaBoxOpen } from "react-icons/fa";
import ghnAPI from "../../api/ghnAPI";
import { Bounce, toast } from "react-toastify";

const OrderRequestDetail = () => {
  const { id } = useParams();
  const [orderRequest, setOrderRequest] = useState(null);
  const navigate = useNavigate();
  const [shopData, setShopData] = useState();
  const [orderDetailGHN, setOrderDetailGHN] = useState();

  useEffect(() => {
    const fetchOrderReq = async () => {
      try {
        const res = await orderRequestAPI.getCancelReqById(id);
        setOrderRequest(res);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu yêu cầu hủy đơn:", error);
      }
    };
    fetchOrderReq();
  }, [id]);
  const fetchShopData = async () => {
    try {
      const res = await ghnAPI.getAddressFOODVC();
      setShopData(res.data.shops[0]);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchOrderData = async () => {
    if (!orderRequest) return;
    try {
      const res = await ghnAPI.getOrderDetailGHN({
        client_order_code: orderRequest.orderId.orderCode,
      });
      setOrderDetailGHN(res.data.order_code);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchShopData();
  }, []);
  useEffect(() => {
    fetchOrderData();
  });

  if (!orderRequest) {
    return <div>Đang tải...</div>;
  }
  const handleCancel = async () => {
    try {
      await orderRequestAPI.updateRequest(id, {
        status: "Rejected",
      });
      navigate("/admin/order-requests");
      toast.info("Yêu cầu đã được loại bỏ!", {
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
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu:", error);
    }
  };
  const handleConfirm = async () => {
    try {
      await orderRequestAPI.updateRequest(id, {
        status: "Approved",
      });
      await ghnAPI.cancelOrder(
        { order_codes: [orderDetailGHN] },
        {
          headers: {
            ShopId: shopData?._id,
          },
        }
      );
      toast.info("Yêu cầu đã được đồng ý!", {
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
      navigate("/admin/order-requests");
    } catch (error) {
      console.error("Lỗi khi đồng ý yêu cầu:", error);
    }
  };
  const { orderId, userId, requestType, reason, status, createdAt } =
    orderRequest;

  return (
    <div className="min-h-screen lg:w-[1050px] md:w-full flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg">
        <h1 className="text-3xl font-bold  mb-6 text-center">
          Chi Tiết Yêu Cầu Hủy Đơn
        </h1>

        {/* User Details */}
        <div className="flex items-center mb-8">
          <img
            src={userId.photoURL}
            alt="Ảnh đại diện"
            className="w-16 h-16 rounded-full border-2 border-green"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold ">{userId.name}</h2>
            <p className="text-green-600">{userId.email}</p>
          </div>
        </div>

        {/* General Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-2  rounded-md">
            <h3 className="text-lg font-medium  flex items-center mb-2">
              <FaClipboardList className="mr-2" /> Loại yêu cầu
            </h3>
            <p className="">
              {requestType === "Cancel"
                ? "Hủy đơn"
                : requestType === "Return"
                ? "Trả hàng/hoàn tiền"
                : "Chỉnh sửa đơn hàng"}
            </p>
          </div>
          <div className="p-2  rounded-md">
            <h3 className="text-lg font-medium  flex items-center mb-2">
              <FaClipboardList className="mr-2" /> Trạng thái
            </h3>
            <p className="">
              {status === "Pending"
                ? "Đang chờ xử lý"
                : status === "Approved"
                ? "Đã chấp nhận"
                : status === "Rejected"
                ? "Đã loại bỏ"
                : status}
            </p>
          </div>
          <div className="p-2  rounded-md">
            <h3 className="text-lg font-medium  flex items-center mb-2">
              <FaClipboardList className="mr-2" /> Lý do
            </h3>
            <p className="">{reason}</p>
          </div>
          <div className="p-2  rounded-md">
            <h3 className="text-lg font-medium  flex items-center mb-2">
              <FaClipboardList className="mr-2" /> Ngày tạo
            </h3>
            <p className="">{new Date(createdAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className=" p-5 rounded-md">
          <h2 className="text-xl font-semibold  flex items-center mb-4">
            <FaBoxOpen className="mr-2" /> Thông Tin Đơn Hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <h3 className=" mb-1">Mã đơn hàng</h3>
              <p className="">{orderId.orderCode}</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <h3 className=" mb-1">Tổng tiền</h3>
              <p className="">{orderId.totalAmount.toLocaleString()} VND</p>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <h3 className=" mb-1">Trạng thái thanh toán</h3>
              <p className="">
                {orderId.paymentStatus ? "Đã thanh toán" : "Chưa thanh toán"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className=" mb-1">Ngày tạo</h3>
              <p className="">{new Date(orderId.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Products List */}
          <div className="mt-3">
            <h3 className="text-lg font-semibold  mb-2">Sản Phẩm</h3>
            <ul className="list-none">
              {orderId.products.map((product) => (
                <li key={product._id} className="0 p-3 rounded-md mb-2">
                  <span className="">
                    Mã sản phẩm: {product.productId}, Số lượng:{" "}
                    {product.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {requestType === "Cancel" && status === "Pending" && (
          <div className="flex justify-end mt-8">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red text-white rounded-md hover:bg-red-600 mr-4"
            >
              Loại bỏ
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-green text-white rounded-md hover:bg-green-600"
            >
              Đồng ý
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderRequestDetail;
