import React, { useEffect, useState } from "react";
import { FaRegStar, FaStar, FaStarHalf, FaUtensils } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import reviewAPI from "../../../api/reviewAPI";
import { Pagination, CircularProgress, Button, styled } from "@mui/material";
import EditShopModal from "../../../components/Modal/EditShopModal";
import shopAPI from "../../../api/shopAPI";
import { useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ShopManagement = () => {
  const { register, handleSubmit, setValue } = useForm({ mode: "onChange" });
  const [photo, setPhoto] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const PF = "http://localhost:3000";
  const [reviews, setReviews] = useState([]);
  const [menuDetails, setMenuDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [address, setAddress] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [shop, setShop] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchShopDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/shop/get-shop-detail/${id}?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const reviewsData = await reviewAPI.getProductById(id);
        setReviews(reviewsData);

        const data = await response.json();
        if (response.ok) {
          setMenuDetails(data.menuDetails);
          setShop(data.shop);
          setTotalPages(data.totalPages);
          setAddress(data.shop.addresses);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [id, page]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredMenuDetails = menuDetails.filter((item) =>
    item.product.name.toLowerCase().includes(searchTerm)
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

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateShop = async (updatedData) => {
    try {
      await shopAPI.updateShop(id, updatedData);
      setShop((prevShop) => ({
        ...prevShop,
        ...updatedData,
      }));

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating shop:", error.response?.data?.message);
    }
  };
  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };
  const onSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("image", photo);
      const res = await shopAPI.updateShop(id, formData);
      console.log(res);

      toast.success("Cập nhật thành công!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Update failed", error);
    }
  };
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const formattedJoinDate = new Date(shop.createdAt).toLocaleDateString(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  );
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý thông tin <span className="text-green">cửa hàng</span>
      </h2>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4 flex items-center space-x-6">
        <div className="text-center">
          <img
            src={
              photo ? URL.createObjectURL(photo) : PF + "/" + shop.shop_image
            }
            alt="Profile Image"
            className="w-40 h-40 object-cover rounded-full border-4 border-gray-200 shadow-lg"
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-40 mb-3">
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#388e3c",
                  },
                  borderRadius: "5px",
                  padding: "10px 20px",
                  marginRight: "10px",
                  textTransform: "none",
                }}
              >
                Chọn ảnh
                <VisuallyHiddenInput
                  type="file"
                  {...register("image")}
                  onChange={handlePhotoChange}
                />
              </Button>
            </div>
            <button className="btn bg-green text-white px-6 border-none hover:bg-green hover:opacity-80">
              Cập nhật <FaUtensils />
            </button>
          </form>
        </div>
        <div>
          <p>
            <strong>Tên cửa hàng:</strong> {shop.shopName}
          </p>
          <p>
            <strong>Mô tả:</strong> {shop.description}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {shop.shop_isOpen ? "Mở cửa" : "Đóng cửa"}
          </p>

          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:underline"
          >
            Chỉnh sửa
          </button>
        </div>
        <div className="">
          <p className="text-gray-700 mt-2">
            <span className="font-semibold">Ngày tham gia: </span>
            {formattedJoinDate}
          </p>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            Đánh giá:
          </h3>
          <p className="flex">
            {renderRating(calculateAverageRating(reviews))}
          </p>
          <p>Số lượng đánh giá: {reviews.length}</p>
        </div>
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
        <input
          type="text"
          className="w-[260px] border border-gray-300 rounded-lg py-2 px-4 mb-6"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMenuDetails.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-slate-100 cursor-pointer"
              onClick={() => navigate(`/product/${item.product._id}`)}
            >
              <img
                src={PF + "/" + item.product.image}
                alt={item.product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold text-md">{item.product.name}</h4>
                <p className="text-gray-600 mt-2">
                  Giá: {item.product.price.toLocaleString()} đ
                </p>
                <div className="flex items-center mt-2">
                  <span className="mr-2 underline ">
                    {item.reviews.length > 0
                      ? (
                          item.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / item.reviews.length
                        ).toFixed(1)
                      : 0}
                  </span>
                  <span className="flex items-center justify-center">
                    {renderRating(calculateAverageRating(item.reviews))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages >= 1 && (
        <div className="flex justify-center mt-4">
          <Pagination count={totalPages} page={page} color="success" />
        </div>
      )}

      <EditShopModal
        open={isModalOpen}
        onClose={handleCloseModal}
        shop={shop}
        onUpdate={handleUpdateShop}
      />
    </div>
  );
};

export default ShopManagement;
