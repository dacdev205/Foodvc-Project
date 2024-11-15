import React from "react";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="max-w-screen-2xl bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
      <div className="relative flex flex-col md:flex-row justify-between items-center gap-8">
        {/* images */}
        <div className="">
          <video className="w-full h-auto" autoPlay loop muted playsInline>
            <source src="/public/video.mp4" />
          </video>
        </div>
        {/* texts */}
        <div className="absolute flex flex-col justify-center  gap-7 px-4 md:px-8 text-center items-center">
          <div>
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug text-white">
              Hãy khám phá niềm vui từ những{" "}
              <span className="bg-green rounded-md">sản phẩm tươi ngon!</span>
            </h2>
            <p className="text-xl text-white text-justify">
              Nơi mỗi loại rau củ và trái cây là một câu chuyện thú vị. Thế giới
              của ẩm thực không chỉ là thưởng thức hương vị tươi mới mà còn là
              khám phá nguồn gốc và lợi ích của từng sản phẩm. Mỗi món đều mang
              trong mình một giá trị dinh dưỡng, một văn hóa, và một cái nhìn
              sâu sắc về cuộc sống khỏe mạnh.
            </p>
            <Link to="/menu">
              <button className="mt-3 bg-green px-8 py-3 font-semibold text-white rounded-full border-style hover:bg-green hover:opacity-80">
                Đặt ngay
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
