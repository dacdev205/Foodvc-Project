/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "../../components/Cards";
import menuAPI from "../../api/menuAPI";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    >
      NEXT
    </div>
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    >
      BACK
    </div>
  );
};

const SpecialDishes = () => {
  const [recipes, setRecipes] = useState([]);
  const slider = React.useRef(null);
  useEffect(() => {
    // Fetch data from the backend
    const fetchDataPopular = async () => {
      try {
        const data = await menuAPI.getAllMenu();
        const specials = data.filter((item) => item.category === "popular");
        setRecipes(specials);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataPopular();
  }, []);
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 970,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 my-20 relative ">
      <div className="text-left">
        <p className="subtitle">Khách hàng yêu thích</p>
        <h2 className="title">Danh mục phổ biến</h2>
      </div>
      <div className="md:absolute right-3 top-8 mb-10 md:mr-24">
        <button
          onClick={() => slider?.current?.slickPrev()}
          className=" btn p-2 rounded-full ml-5"
        >
          <FaAngleLeft className=" h-8 w-8 p-1" />
        </button>
        <button
          className="bg-green btn p-2 rounded-full ml-5"
          onClick={() => slider?.current?.slickNext()}
        >
          <FaAngleRight className=" h-8 w-8 p-1 " />
        </button>
      </div>

      <div className="section-container">
        <Slider
          ref={slider}
          {...settings}
          className="overflow-hidden mt-10 space-x-5 "
        >
          {recipes.map((item, i) => (
            <Cards item={item} key={i} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default SpecialDishes;
