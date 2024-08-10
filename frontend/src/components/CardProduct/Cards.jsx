/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";
import cartAPI from "../../api/cartAPI";
import wishListAPI from "../../api/wishListAPI";
import reviewAPI from "../../api/reviewAPI";
import useCart from "../../hooks/useCart";
import useWishList from "../../hooks/useWishList";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUserCurrent from "../../hooks/useUserCurrent";
import axios from "axios";
const token = localStorage.getItem("access-token");

const Cards = ({ item }) => {
  const { user } = useContext(AuthContext);
  const userData = useUserCurrent();
  const PF = "http://localhost:3000";
  const [reviews, setReviews] = useState([]);
  const [, refetchCart] = useCart();
  const [, refetchWishList] = useWishList();
  const [heartFilledIds, setHeartFilledIds] = useState(
    JSON.parse(localStorage.getItem("heartFilledIds")) || []
  );
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const reviewsData = await reviewAPI.getProductById(
          item?.productId?._id
        );
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [item?.productId?._id]);

  useEffect(() => {
    localStorage.setItem("heartFilledIds", JSON.stringify(heartFilledIds));
  }, [heartFilledIds]);

  const isHeartFilled = heartFilledIds.includes(item?.productId?._id);

  const handleAddToCart = async () => {
    const cartItem = {
      userId: userData._id,
      productId: item?.productId?._id,
      quantity: 1,
    };

    try {
      await cartAPI.postToCart(cartItem);
      toast.success("Thêm vào giỏ hàng thành công!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      refetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Lỗi khi thêm vào giỏ hàng.", {
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
    }
  };

  const handleAddToWishList = async () => {
    if (user && user?.email) {
      const wishItem = {
        userId: userData._id,
        product: item?.productId?._id,
      };

      try {
        if (!isHeartFilled) {
          await wishListAPI.addProductToWishList(wishItem);
          toast.success("Đã thêm vào sản phẩm yêu thích!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setHeartFilledIds((prevIds) => [...prevIds, item?.productId?._id]);
        } else {
          const wishListItem = await wishListAPI.getProductToWishList(
            item?.productId?._id
          );

          await wishListAPI.deleteProduct(wishListItem._id);
          toast.info("Đã xóa khỏi sản phẩm yêu thích!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setHeartFilledIds((prevIds) =>
            prevIds.filter((id) => id !== item?.productId?._id)
          );
        }
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi thêm vào yêu thích.", {
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
      }
    }
    refetchWishList(); // Refetch danh sách yêu thích
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating;
  };

  const formattedPrice = (price) => {
    const priceNumber = new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price);

    const [, decimalPart] = priceNumber.split(",");

    if (decimalPart && parseInt(decimalPart) >= 5) {
      return new Intl.NumberFormat("vi-VN", {
        currency: "VND",
      }).format(Math.ceil(price));
    }

    return priceNumber;
  };

  return (
    <div>
      <div className="card mr-5 md:my-5 shadow-xl relative hover:scale-105 transition-all duration-200">
        {/* icon wish list */}
        <div
          className={`rating gap-1 absolute cursor-pointer right-2 top-2 p-4 z-10 heartStar bg-green ${
            isHeartFilled ? "text-rose-500" : "text-white"
          }`}
          onClick={handleAddToWishList}
        >
          <FaHeart />
        </div>
        {item.quantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white text-lg font-bold bg-black bg-opacity-50 py-10 px-4 rounded-full no-hover-fade">
              <p className="text-opacity-100">Hết hàng</p>
            </span>
          </div>
        )}

        <Link to={`/product/${item?.productId?._id}`}>
          <figure>
            <img
              src={PF + "/" + item?.productId?.image}
              alt={item?.productId?.name || "Product Image"}
              className=" md:h-72 cursor-pointer"
            />
          </figure>
        </Link>
        {/* card content */}
        <div className="card-body ">
          <Link to={`/product/${item?.productId?._id}`}>
            <h2 className="card-title cursor-pointer text-black">
              {item?.productId?.name
                ? item?.productId?.name.slice(0, 20)
                : "Tên sản phẩm"}
              ...
            </h2>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="flex items-center text-black">
                <span>{calculateAverageRating(reviews).toFixed(1)}</span>
                <FaStar color="ffc107"></FaStar>
              </span>
              <span className="ml-1 text-xs text-grey-700">
                ({reviews.length} đánh giá)
              </span>
            </div>
            <div className="flex">
              <p className="text-md font-bold text-black">
                {formattedPrice(item?.productId?.price)} <span>₫</span>
              </p>
            </div>
          </div>

          <button
            className={`btn bg-green text-white hover:bg-green hover:opacity-80 border-style ${
              item.quantity === 0 ? "disabled" : ""
            }`}
            onClick={handleAddToCart}
            disabled={item.quantity === 0}
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cards;
