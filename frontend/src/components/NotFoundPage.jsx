import React from "react";
import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <div>
        <Link to="/">
          <button className="btn bg-green text-white">Trở về trang chủ.</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
