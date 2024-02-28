import React from "react";

const serviceLists = [
  {
    id: 1,
    title: "Dịch vụ ăn uống",
    des: "Text example Description",
    image: "/images/home/services/icon1.png",
  },
  {
    id: 2,
    title: "Chuyển phát nhanh",
    des: "Text example Description",
    image: "/images/home/services/icon2.png",
  },
  {
    id: 3,
    title: "Đặt hàng trực tuyến",
    des: "Text example Description",
    image: "/images/home/services/icon3.png",
  },
  {
    id: 4,
    title: "Thẻ quà tặng",
    des: "Text example Description",
    image: "/images/home/services/icon4.png",
  },
];

const OurService = () => {
  return (
    <div className="section-container my-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        {/*text  */}
        <div className="md:w-1/2">
          <div className="text-left md:w-4/5">
            <p className="subtitle">CÂU CHUYỆN & DỊCH VỤ CỦA CHÚNG TÔI</p>
            <h3 className="title">
              Hành trình và dịch vụ ẩm thực của chúng tôi
            </h3>
            <blockquote className="my-5 text-secondary leading-[30px]">
              Bắt nguồn từ niềm đam mê, chúng tôi tuyển chọn những trải nghiệm
              ẩm thực khó quên và cung cấp các dịch vụ đặc biệt, kết hợp nghệ
              thuật ẩm thực với lòng hiếu khách nồng hậu.
            </blockquote>
            <button className="btn bg-green text-white px-8 py-3 rounded-full">
              Khám phá
            </button>
          </div>
        </div>

        {/* images */}
        <div className="md:w-1/2">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-8 items-center">
            {serviceLists.map((service) => (
              <div
                key={service.id}
                className="shadow-md transition-all duration-200 rounded-sm py-5 px-4 text-center space-y-2 text-green cursor-pointer"
              >
                <img src={service.image} alt="" className="mx-auto" />
                <h5 className="pt-3 font-semibold">{service.title}</h5>
                <p className="text-[#90bđ5]">{service.des}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurService;
