import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-rose-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-4">
          Trang bạn tìm không tồn tại 😢.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Có vẻ như trang bạn đang tìm kiếm không còn tồn tại hoặc đã bị xóa.
        </p>
        <button
          onClick={handleGoBack}
          className="btn bg-green text-white border-none hover:bg-green hover:opacity-80 px-5 py-2 rounded"
        >
          Quay lại trang trước
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
