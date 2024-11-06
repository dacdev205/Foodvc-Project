import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalf } from "react-icons/fa";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import reviewAPI from "../../api/reviewAPI";
import { CircularProgress, Pagination } from "@mui/material";
import ShopFavoriteButton from "../../components/ShopFavoriteButton";
import useUserCurrent from "../../hooks/useUserCurrent";

const SearchResult = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const result = state?.result;
  const navigate = useNavigate();
  const PF = "http://localhost:3000";
  const [reviews, setReviews] = useState([]);
  const [menuDetails, setMenuDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const isShop = !!result?.shopName;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [address, setAddress] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteUserIds, setFavoriteUserIds] = useState([]);
  const userData = useUserCurrent();

  useEffect(() => {
    const fetchShopMenuDetails = async (page = 1) => {
      try {
        const response = await fetch(
          `http://localhost:3000/shop/get-shop/${result._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const reviewsData = await reviewAPI.getProductById(id);
        setReviews(reviewsData);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setMenuDetails(data.menuDetails);
          setTotalPages(data.totalPages);
          setAddress(data.shop.addresses);
          setFavoriteUserIds(data.favoriteUserIds || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isShop) {
      fetchShopMenuDetails(page);
    } else {
      setLoading(false);
    }
  }, [page, id, isShop, result]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredMenuDetails = menuDetails.filter((item) =>
    item.product.name.toLowerCase().includes(searchTerm)
  );

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <CircularProgress color="success" />
      </div>
    );

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating;
  };

  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} style={{ fontSize: "18px", color: "#ffc107" }}>
          <FaStar />
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" style={{ fontSize: "18px", color: "#ffc107" }}>
          <FaStarHalf />
        </span>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} style={{ fontSize: "18px", color: "#ffc107" }}>
          <FaRegStar />
        </span>
      );
    }

    return stars;
  };

  const {
    name,
    email,
    shopName,
    shop_image,
    shop_isOpen,
    shop_isActive,
    shop_rating,
    description,
    createdAt,
  } = result;

  if (loading) {
    return (
      <div className="text-center text-lg text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };
  const formattedJoinDate = new Date(createdAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-8">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full lg:w-2/3">
        <h1
          className={`text-4xl font-bold text-center ${
            isShop ? "text-black" : "text-black"
          } mb-8`}
        >
          {isShop ? "Thông tin cửa hàng" : "Thông tin người dùng"}
        </h1>

        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
          {shop_image ? (
            <img
              src={PF + "/" + shop_image}
              alt={name || shopName || "Profile Image"}
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 shadow-lg mb-6 lg:mb-0"
            />
          ) : (
            <img
              src={result.photoURL || "https://via.placeholder.com/150"}
              alt={name || shopName || "Profile Image"}
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 shadow-lg mb-6 lg:mb-0"
            />
          )}

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {shopName || name}
            </h2>

            {isShop ? (
              <>
                <ShopFavoriteButton
                  shopId={result._id}
                  favoriteUserIds={favoriteUserIds}
                  currentUserId={userData?._id}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p className="text-gray-700">
                    <span className="font-semibold">Trạng thái cửa hàng: </span>
                    <span className={shop_isOpen ? "text-green" : "text-red"}>
                      {shop_isOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      Số lượng người yêu thích:{" "}
                    </span>
                    <span className="text-green-600">
                      {favoriteUserIds.length}
                    </span>
                  </p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold">Ngày tham gia: </span>
                    {formattedJoinDate}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Hoạt động: </span>
                    <span
                      className={
                        shop_isActive ? "text-green-600" : "text-red-600"
                      }
                    >
                      {shop_isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </p>

                  <p className="text-gray-700">
                    <span className="font-semibold">Đánh giá: </span>
                    <span>{shop_rating.toFixed(1)}/5</span>
                  </p>

                  <p className="text-gray-700 col-span-2">
                    <span className="font-semibold">Mô tả: </span>
                    <span>{description || "Không có mô tả"}</span>
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Địa chỉ cửa hàng:
                  </h3>
                  <ul className="space-y-2">
                    {address.map((addr) => (
                      <li
                        key={addr._id}
                        className="text-gray-600 bg-gray-100 p-2 rounded-md"
                      >
                        <div>
                          <span className="font-semibold">Thành phố: </span>
                          {addr.city.cityName}
                        </div>

                        <div>
                          <span className="font-semibold">Số điện thoại: </span>
                          {addr.phone}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Thực đơn của cửa hàng:
                  </h3>
                  {/* Search Input */}
                  <div className="mb-6">
                    <input
                      type="text"
                      className="w-[260px] border border-gray-300 rounded-lg py-2 px-4"
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMenuDetails.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-slate-100 cursor-pointer"
                        onClick={() => handleProductClick(item.product._id)}
                      >
                        <img
                          src={PF + "/" + item.product.image}
                          alt={item.product.name}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-md">
                            {item.product.name}
                          </h4>
                          <p className="text-gray-600 mt-2">
                            Giá: {item.product.price.toLocaleString()} đ
                          </p>
                          <div className="flex items-center mt-2 ">
                            <span className="mr-2 underline ">
                              {calculateAverageRating(item.reviews).toFixed(1)}
                            </span>
                            <span className="flex items-center justify-center">
                              {renderRating(
                                calculateAverageRating(item.reviews)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-700">
                  <span className="font-semibold">Email: </span>
                  {email}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Ngày tham gia: </span>
                  {formattedJoinDate}
                </p>
                <p className="text-gray-700 mt-2">
                  <span className="font-semibold">Hạng người dùng: </span>
                  {result.rank?.user_rank_name || "N/A"}
                </p>
              </>
            )}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="success"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
