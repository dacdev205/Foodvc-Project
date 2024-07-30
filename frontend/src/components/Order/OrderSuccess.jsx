// src/pages/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r bg-slate-100">
      <div className="bg-white shadow-xl rounded-lg p-8 text-center space-y-6 transform transition-all duration-500 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-green mb-4">
          Đặt hàng thành công!
        </h1>
        <p className="text-xl text-gray-800">
          Cảm ơn bạn đã đặt hàng tại <span className="font-bold">FOODVC</span>.
          Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
        </p>
        <p className="text-lg text-black">
          Bạn sẽ được chuyển hướng về trang chủ sau {countdown} giây.
        </p>
        <Link
          to="/"
          className="inline-block bg-green text-white font-semibold py-3 px-6 rounded-full hover:bg-green"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
