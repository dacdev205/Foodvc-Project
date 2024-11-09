import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import orderAPI from "../api/orderAPI";
import cartAPI from "../api/cartAPI";
import useCart from "../hooks/useCart";
import LoadingSpinner from "../ultis/LoadingSpinner";
import ghnAPI from "../api/ghnAPI";
import useUserCurrent from "../hooks/useUserCurrent";

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const [paymentResult, setPaymentResult] = useState({});
  const navigate = useNavigate();
  const [cart, refetchCart] = useCart();
  const user = useUserCurrent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderData = JSON.parse(localStorage.getItem("orderData"));
  const shopId = orderData.shopId;

  const formattedDate = paymentResult.payDate
    ? moment(paymentResult.payDate, "YYYYMMDDHHmmss").format(
        "DD/MM/YYYY HH:mm:ss"
      )
    : "";
  const saveTransaction = async (transactionData) => {
    try {
      await axios.post("http://localhost:3000/transactions", transactionData);
      console.log("Thông tin giao dịch đã được lưu.");
    } catch (error) {
      console.error("Lỗi khi lưu giao dịch:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      const amount = searchParams.get("vnp_Amount");
      const result = {
        amount: amount / 100,
        bankCode: searchParams.get("vnp_BankCode"),
        bankTranNo: searchParams.get("vnp_BankTranNo"),
        cardType: searchParams.get("vnp_CardType"),
        orderInfo: searchParams.get("vnp_OrderInfo"),
        payDate: searchParams.get("vnp_PayDate"),
        responseCode: searchParams.get("vnp_ResponseCode"),
        transactionNo: searchParams.get("vnp_TransactionNo"),
        transactionStatus: searchParams.get("vnp_TransactionStatus"),
        txnRef: searchParams.get("vnp_TxnRef"),
        tmnCode: searchParams.get("vnp_TmnCode"),
        secureHash: searchParams.get("vnp_SecureHash"),
        userId: user?._id,
        shopId: shopId,
        orderCode: orderData?.orderCode,
      };

      setPaymentResult(result);

      if (result.transactionNo) {
        saveTransaction(result);
      }
    }
  }, [orderData.orderCode, searchParams, shopId, user?._id]);

  const isPaymentSuccessful = paymentResult.responseCode === "00";
  const sendEmailToUser = async (email, orderCode) => {
    try {
      await axios.post("http://localhost:3000/email", {
        email: email,
        subject: "Xác nhận đơn hàng từ FOODVC",
        html: `
        <html>
        <head>
          <style>
            @import url('https://unpkg.com/tailwindcss@^2.0/dist/tailwind.min.css');
          </style>
        </head>
        <body class="font-sans bg-gray-100">
          <div class="max-w-xl mx-auto p-8 bg-white rounded shadow">
            <h1 class="text-2xl font-bold text-center text-gray-800 mb-4">Xác nhận đơn hàng của bạn</h1>
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Mã đơn hàng: ${orderCode}</h2>
            <p class="text-gray-600 mb-2"><span class="font-semibold">Email:</span> ${email}</p>
            <p class="text-gray-600 mb-4">Cảm ơn bạn đã mua sắm tại FOODVC. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
          </div>
        </body>
        </html>
      `,
      });
    } catch (error) {
      console.error("Error sending email to:", email, error);
    }
  };
  useEffect(() => {
    const sendParamsToIPN = async () => {
      try {
        const result = {
          vnp_Amount: searchParams.get("vnp_Amount"),
          vnp_BankCode: searchParams.get("vnp_BankCode"),
          vnp_BankTranNo: searchParams.get("vnp_BankTranNo"),
          vnp_CardType: searchParams.get("vnp_CardType"),
          vnp_OrderInfo: searchParams.get("vnp_OrderInfo"),
          vnp_PayDate: searchParams.get("vnp_PayDate"),
          vnp_ResponseCode: searchParams.get("vnp_ResponseCode"),
          vnp_TmnCode: searchParams.get("vnp_TmnCode"),
          vnp_TransactionNo: searchParams.get("vnp_TransactionNo"),
          vnp_TransactionStatus: searchParams.get("vnp_TransactionStatus"),
          vnp_TxnRef: searchParams.get("vnp_TxnRef"),
          vnp_SecureHash: searchParams.get("vnp_SecureHash"),
        };
        console.log(result);

        const response = await axios.get(
          "http://localhost:3000/method-deli/vnpay_ipn",
          { params: result }
        );
        console.log(response);

        if (response.data.RspCode === "00") {
          localStorage.setItem("RspCode", response.data.RspCode);
        } else {
          console.error("IPN failed:", response.data);
        }
      } catch (error) {
        console.error("Error sending IPN params:", error);
      }
    };
    sendParamsToIPN();
  }, [searchParams]);
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };
  const handleReturnHome = async () => {
    setIsSubmitting(true);
    try {
      const orderData = JSON.parse(localStorage.getItem("orderData"));
      const rspCode = localStorage.getItem("RspCode");
      const payload = localStorage.getItem("orderDataPostGHN");

      if (orderData && rspCode === "00") {
        const res = {
          userId: orderData.userId,
          shopId: orderData.shopId,
          products: orderData.products,
          totalAmount: orderData.totalAmount,
          note: orderData.note,
          orderCode: orderData.orderCode,
          addressId: orderData.addressId,
          methodId: orderData.methodId,
        };

        await sendEmailToUser(user.email, orderData.orderCode);

        await orderAPI.postProductToOrder(res);

        await Promise.all(
          orderData.products.map(async (product) => {
            if (product) {
              try {
                await cartAPI.deleteProduct(cart._id, product.productId._id);
              } catch (error) {
                console.warn(
                  `Failed to delete product ${product.productId._id} from cart. Continuing...`
                );
              }
            }
          })
        );

        const createOrderGhn = await ghnAPI.createOrder(payload);
        if (createOrderGhn.status !== 200) {
          console.error("Lỗi tạo đơn hàng GHN:", createOrderGhn.message);
          return;
        }
      }

      localStorage.removeItem("orderData");
      localStorage.removeItem("RspCode");
      localStorage.removeItem("orderDataPostGHN");
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsSubmitting(false);
      refetchCart();
      navigate("/user/orders");
    }
  };

  if (!user) return <LoadingSpinner />;
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
          <LoadingSpinner />
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isPaymentSuccessful
            ? "Thanh toán thành công!"
            : "Thanh toán thất bại"}
        </h1>

        {isPaymentSuccessful ? (
          <div className="text-center text-green-700">
            <p className="text-lg mb-2">
              Mã giao dịch:{" "}
              <span className="font-semibold">
                {paymentResult.transactionNo}
              </span>
            </p>
            <p className="text-lg mb-2">
              Số tiền:{" "}
              <span className="font-semibold">
                {formatAmount(paymentResult.amount)}
              </span>
            </p>
            <p className="text-lg mb-4">
              Ngày thanh toán:{" "}
              <span className="font-semibold">{formattedDate}</span>
            </p>
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2l4-4m-7 5l-4-4l1.414-1.414l2.586 2.586L16.586 7L18 8.414l-7 7z"
                ></path>
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-700">
            <p className="text-lg mb-4">Mã lỗi: {paymentResult.responseCode}</p>
            <div className="flex justify-center">
              <svg
                className="w-16 h-16 text-red-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2l4-4M6 18L18 6M4 10v10h10m-7-7H5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2z"
                ></path>
              </svg>
            </div>
          </div>
        )}

        <button
          onClick={handleReturnHome}
          className="mt-6 w-full bg-green hover:bg-green hover:opacity-80 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Về trang mua
        </button>
      </div>
    </div>
  );
};

export default VNPayReturn;
