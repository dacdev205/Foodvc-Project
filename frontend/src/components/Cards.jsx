/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import cartAPI from "../api/cartAPI";
import wishListAPI from "../api/wishListAPI";
import Swal from "sweetalert2";
import reviewAPI from "../api/reviewAPI";
import useCart from "../hooks/useCart";
import useWishList from "../hooks/useWishList";

import { FaStar } from "react-icons/fa";
const Cards = ({ item }) => {
  const {
    name,
    image,
    price,
    recipe,
    _id,
    category,
    productionLocation,
    instructions,
    expirationDate,
    storage,
    createdAt,
  } = item;
  const { user } = useContext(AuthContext);
  const PF = "http://localhost:3000";
  const [reviews, setReviews] = useState([]);
  const [cart, refetchCart, isLoading] = useCart();
  const [wishList, refetchWishList] = useWishList();

  const [heartFilledIds, setHeartFilledIds] = useState(
    JSON.parse(localStorage.getItem("heartFilledIds")) || []
  );
  const isHeartFilled = heartFilledIds.includes(_id);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const reviewsData = await reviewAPI.getProductById(_id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [_id]);
  useEffect(() => {
    localStorage.setItem("heartFilledIds", JSON.stringify(heartFilledIds));
  }, [heartFilledIds]);
  const handleAddToCart = async () => {
    if (user && user?.email) {
      const cartItem = {
        _id,
        name,
        quantity: 1,
        price,
        recipe,
        category,
        image,
        productionLocation,
        instructions,
        expirationDate,
        createdAt,
        storage,
        email: user.email,
      };
      await cartAPI.postProductToCart(cartItem);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Food added on the cart.",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    refetchCart();
  };

  const handleAddToWishList = async (item) => {
    if (user && user?.email) {
      const wishItem = {
        _id,
        name,
        quantity: 1,
        price,
        recipe,
        category,
        image,
        email: user.email,
      };
      try {
        setHeartFilledIds((prevIds) => {
          if (!prevIds.includes(_id)) {
            return [...prevIds, _id];
          } else {
            return prevIds.filter((id) => id !== _id);
          }
        });

        if (!isHeartFilled) {
          await wishListAPI.addProductToWishList(wishItem);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Food added on the wish list.",
            showConfirmButton: false,
            timer: 700,
          });
        } else {
          await wishListAPI.deleteProduct(wishItem._id);
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Food deleted on the wish list.",
            showConfirmButton: false,
            timer: 700,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    refetchWishList();
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
    <div className="card mr-5 md:my-5 shadow-xl relative hover:scale-105 transition-all duration-200">
      {/* icon wish list */}
      <div
        className={`rating gap-1 absolute cursor-pointer right-2 top-2 p-4 z-10 heartStar bg-green ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={() => handleAddToWishList(item)}
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

      <Link to={`/product/${item._id}`}>
        <figure>
          <img
            src={PF + "/" + item.image}
            alt=""
            className=" md:h-72 cursor-pointer"
          />
        </figure>
      </Link>
      {/* card content */}
      <div className="card-body ">
        <Link to={`/product/${item._id}`}>
          <h2 className="card-title cursor-pointer text-black">
            {item.name.slice(0, 20)}...
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
              {formattedPrice(item.price)} <span>₫</span>
            </p>
          </div>
        </div>

        <button
          className="btn bg-green text-white hover:bg-green hover:opacity-80 border-style"
          onClick={() => handleAddToCart()}
          disabled={item.quantity === 0}
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default Cards;
