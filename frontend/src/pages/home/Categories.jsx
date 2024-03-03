import React from "react";

const categoryItems = [
  {
    id: 1,
    title: "Main Dish",
    desc: "86 dishes",
    image: "/images/home/category/img1.png",
  },
  {
    id: 2,
    title: "Main Dish",
    desc: "86 dishes",
    image: "/images/home/category/img2.png",
  },
  {
    id: 3,
    title: "Main Dish",
    desc: "86 dishes",
    image: "/images/home/category/img3.png",
  },
  {
    id: 4,
    title: "Main Dish",
    desc: "86 dishes",
    image: "/images/home/category/img4.png",
  },
];

const Categories = () => {
  return (
    <div className="section-container py-16">
      <div className="text-center">
        <p className="subtitle">khách hàng yêu thích</p>
        <h3 className="title">Danh mục phổ biến</h3>
      </div>

      {/* category cards */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-8 justify-around items-center mt-12 ">
        {categoryItems.map((item, i) => (
          <div
            key={i}
            className="shadow-lg rounded-md bg-white text-black py-6 px-5 w-72 mx-auto text-center cursor-pointer hover:-translate-y-4 duration-300 transition-all"
          >
            <div className="flex w-full mx-auto items-center justify-center">
              <img
                src={item.image}
                alt=""
                className="bg-[#C1F1C6] p-5 rounded-full w-28 h-28"
              />
            </div>
            <div>
              <h5>{item.title}</h5>
              <h5>{item.desc}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
Categories;
