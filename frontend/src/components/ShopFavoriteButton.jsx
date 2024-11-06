/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import wishListAPI from "../api/wishListAPI"; // Update with your actual API method
import { Bounce, toast } from "react-toastify";

const ShopFavoriteButton = ({
  shopId,
  favoriteUserIds = [],
  currentUserId,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(favoriteUserIds.includes(currentUserId));
  }, [favoriteUserIds, currentUserId]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        const res = await wishListAPI.deleteStore({
          userId: currentUserId,
          shopId: shopId,
        });

        setIsFavorited(false);
        toast.info("Đã bỏ yêu thích cửa hàng", {
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
      } else {
        await wishListAPI.addShopToWishList({
          userId: currentUserId,
          shop: shopId,
        });
        setIsFavorited(true);
        toast.success("Đã thêm yêu thích cửa hàng", {
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
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      className="flex items-center px-4 py-2 bg-red text-white rounded-md shadow-md transition duration-200 mb-4"
    >
      <FaHeart className="mr-2" />
      {isFavorited ? "Bỏ yêu thích" : "Yêu thích"}
    </button>
  );
};

export default ShopFavoriteButton;
