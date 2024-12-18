/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "../../components/CardProduct/Cards";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import useMenu from "../../hooks/useMenu";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("NỔI BẬT");
  const [page, setPage] = useState(1);
  const [menu, totalPages, refetch, isLoading, error] = useMenu(
    searchTerm,
    filterType,
    category,
    page,
    8
  );

  useEffect(() => {
    const fetchDataPopular = async () => {
      const specials = menu.filter(
        (item) => item.productId.category.name === "NỔI BẬT"
      );

      if (JSON.stringify(specials) !== JSON.stringify(recipes)) {
        setRecipes(specials);
      }
    };

    if (menu && menu.length > 0) {
      fetchDataPopular();
    }
  }, [menu, recipes]);

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
          className=" btn bg-slate-300 hover:bg-slate-300 p-2 rounded-full ml-5 text-black border-style"
        >
          <FaAngleLeft className=" h-8 w-8 p-1" />
        </button>
        <button
          className="btn bg-slate-200 hover:bg-slate-300  p-2 rounded-full ml-5 text-black border-style"
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
