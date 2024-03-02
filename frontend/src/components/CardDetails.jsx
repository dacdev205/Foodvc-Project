/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import menuAPI from "../api/menuAPI";
import reviewAPI from "../api/reviewAPI";
import ReviewForm from "../components/ReviewForm";
import { AuthContext } from "../context/AuthProvider";
import cartAPI from "../api/cartAPI";
import Swal from "sweetalert2";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "../style.css";
import { FaStar, FaRegStar, FaStarHalf } from "react-icons/fa";
import { useForm } from "react-hook-form";
import inventoryAPI from "../api/inventoryAPI";
import useCart from "../hooks/useCart";
import ReviewFormEdit from "./ReviewFormEdit";
import paymentAPI from "../api/paymentAPI";
import orderAPI from "../api/orderAPI";
import Modal from "./Modal";
const CardDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const PF = "https://foodvc-server.onrender.com";
  const { reset } = useForm();
  const [currentRating, setRating] = useState(0);
  const [quantityDefault, setQuantity] = useState(1);
  const [isExpanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceOrginals, setPrices] = useState([]);
  const [cart, refetchCart] = useCart();
  const [commented, setCommented] = useState(false);
  const [editReviewId, setEditReviewId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();
  const formatDateTimeProductCreate = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("vi-VN", options);
  };
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("vi-VN", options);
  };
  const itemsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await menuAPI.getProductById(id);
        setProduct(response);
        const reviewsData = await reviewAPI.getProductById(id);
        setReviews(reviewsData);
        const priceOriginalData = await inventoryAPI.getProductById(id);
        setPrices(priceOriginalData);
        const commentedByUser = localStorage.getItem(`${id}-${user.uid}`);
        if (commentedByUser) {
          setCommented(true);
        }
      } catch (error) {
        if (!user && !user?.email) {
          return;
        }
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [id]);
  // handleIncrease
  const handleIncrease = () => {
    const newQuantity = quantityDefault + 1;
    if (newQuantity > product.quantity) {
      setQuantity(product.quantity);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleToggleExpand = () => {
    setExpanded(!isExpanded);
  };
  // handleDecrease;
  const handleDecrease = () => {
    const newQuantity = Math.max(1, quantityDefault - 1);
    setQuantity(newQuantity);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const newQuantity = Math.max(1, parseInt(newValue, 10) || 1);
    if (newQuantity > product.quantity) {
      alert("Số lượng sản phẩm vượt quá số lượng hiện có");
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (product) => {
    if (user && user?.email) {
      const cartItem = {
        _id: product._id,
        name: product.name,
        quantity: quantityDefault,
        price: product.price,
        recipe: product.recipe,
        category: product.category,
        productionLocation: product.productionLocation,
        instructions: product.instructions,
        expirationDate: product.expirationDate,
        createdAt: product.createdAt,
        storage: product.storage,
        image: product.image,
        email: user.email,
      };
      if (product.quantity === 0) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `${product.name} is out of stock.`,
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        await cartAPI.postProductToCart(cartItem);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Food added on the cart.",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } else {
      document.getElementById("modal-login").showModal();
    }
    refetchCart();
  };

  const handleReviewSubmit = async (reviewData) => {
    const userOrders = await orderAPI.getUserOrders(user.uid);
    let productFound = false;
    userOrders.forEach((userOrder) => {
      userOrder.products.forEach((productOrder) => {
        if (productOrder._id === product._id) {
          productFound = true;
          return;
        }
      });
    });

    if (!productFound) {
      alert("Vui lòng mua sản phẩm trước khi đánh giá");
      return;
    }
    await reviewAPI.addReview({
      ...reviewData,
      userId: user.uid,
      userName: user.displayName,
    });

    localStorage.setItem(`${id}-${user.uid}`, "commented");
    setCommented(true);
    const updatedReviews = await reviewAPI.getProductById(id);
    setReviews(updatedReviews);
    reset();
  };

  const renderReviewFormOrMessage = () => {
    if (commented) {
      return <p>Bạn đã bình luận về sản phẩm này.</p>;
    } else {
      return (
        <ReviewForm productId={product._id} onSubmit={handleReviewSubmit} />
      );
    }
  };
  const renderRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setRating(i)}
          style={{
            fontSize: "18px",
            color: "#ffc107",
            display: "inline-block",
          }}
        >
          <FaStar />
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span
          key="half"
          onClick={() => setRating(fullStars + 0.5)}
          style={{
            fontSize: "18px",
            color: "#ffc107",
          }}
        >
          <FaStarHalf />
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span
          key={`empty-${i}`}
          onClick={() => setRating(fullStars + i + 1)}
          style={{
            fontSize: "18px",
            color: "#ffc107",
            display: "inline-block",
          }}
        >
          <FaRegStar />
        </span>
      );
    }

    return stars;
  };
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      return 0;
    }
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating;
  };
  const sortedReviews = reviews.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const currentReviews = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);

  const handleDeleteComment = async (reviewId) => {
    try {
      await reviewAPI.deleteCommentByReviewId(reviewId);
      const updatedReviews = await reviewAPI.getProductById(id);
      setReviews(updatedReviews);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Comment deleted successfully.",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error deleting comment.",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
  const handleEditComment = (reviewId) => {
    setEditReviewId(reviewId);
    setIsModalOpen(true);
  };
  const handleToggleActions = () => {
    setShowActions(!showActions);
  };
  const handleCheckOutNow = async () => {
    try {
      if (!user && !user?.email) {
        document.getElementById("modal-login").showModal();
        return;
      }
      await paymentAPI.postProductToPayment({
        email: user.email,
        products: {
          ...product,
          quantity: quantityDefault,
        },
      });
      navigate("/check-out");
    } catch (error) {
      console.error("Error during check-out:", error);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }
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
    <div className="section-container ">
      <div className="pt-28 max-w-screen-2xl container mx-auto xl:px-28 px-4 text-black">
        <div className="py-3 max-w-7xl m-auto">
          <div className="mt-6 sm:mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 sm:grid:cols-2 gap-6 h-max">
              <div className="relative">
                <img src={PF + "/" + product.image} alt="" className="w-full" />
                {product.quantity === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-lg font-bold bg-black bg-opacity-50 py-10 px-4 rounded-full no-hover-fade">
                      <p className="text-opacity-100">Hết hàng</p>
                    </span>
                  </div>
                )}
              </div>

              {/* product detail */}
              <div>
                <h1 className="title">{product.name.slice(0, 30)}...</h1>
                <div className="flex mb-3">
                  {/* rating */}
                  <span className="mr-2 underline">
                    {calculateAverageRating(reviews).toFixed(1)}
                  </span>
                  <span className="flex items-center justify-center">
                    {renderRating(calculateAverageRating(reviews))}
                  </span>
                  {/* length reviews*/}
                  <div className="ml-3">
                    <span className="text-md underline">{reviews.length}</span>
                    <span className="text-slate-600 ml-1"> đánh giá</span>
                  </div>
                </div>
                {/* price */}
                <p className="text-lg font-bold ">
                  {formattedPrice(product.price)}
                  <span>₫</span>
                </p>
                {priceOrginals.applyVoucher ? (
                  <div className="flex">
                    <p className="text-sm flex justify-end text-gray-600 line-through">
                      {formattedPrice(priceOrginals.price)} <span>₫</span>
                    </p>
                  </div>
                ) : (
                  ""
                )}
                {/* quantity */}
                <div>
                  <span>Số lượng: </span>
                  <button
                    className="btn btn-xs "
                    onClick={() => handleDecrease()}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantityDefault}
                    onChange={handleInputChange}
                    className="valueQuantity w-10 mx-2 text-center overflow-hidden appearance-none"
                  />
                  <button
                    onClick={() => handleIncrease()}
                    className="btn btn-xs"
                  >
                    +
                  </button>
                  <span className="ml-3 text-slate-600 text-sm">
                    {product.quantity} sản phẩm có sẵn
                  </span>
                </div>
                <button
                  className="mt-3 btn bg-green text-white "
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  className={`mt-10 ml-3 btn bg-green text-white ${
                    product.quantity === 0 ? "cursor-not-allowed" : ""
                  }`}
                  onClick={handleCheckOutNow}
                  disabled={product.quantity === 0}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Product details */}
        <div>
          <table className="table max-w-screen-sm rounded-lg">
            <thead>
              <tr>
                <th className="border p-2 bg-green text-white">Thông tin:</th>
                <th className="border p-2 bg-green text-white">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Thương hiệu:</td>
                <td className="border p-2 text-gray-500">{product.brand}</td>
              </tr>
              <tr>
                <td className="border p-2">Loại sản phẩm:</td>
                <td className="border p-2 text-gray-500">
                  {product.category === "popular"
                    ? "Nổi bật"
                    : product.category === "soup"
                    ? "Mì, miến, cháo phở"
                    : product.category === "milk"
                    ? "Sữa các loại"
                    : product.category === "vegetable"
                    ? "Rau, củ, nấm, trái cây"
                    : product.category === "protein"
                    ? "Thịt, cá, trứng, hải sản"
                    : product.category === "drinks"
                    ? "Bia, nước giải khát"
                    : product.category}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Ngày sản xuất:</td>
                <td className="border p-2 text-gray-500">
                  {formatDateTimeProductCreate(product.createdAt)}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Hướng dẫn sử dụng:</td>
                <td className="border p-2 text-gray-500">
                  {product.instructions}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Hạn sử dụng:</td>
                <td className="border p-2 text-gray-500">
                  {formatDateTimeProductCreate(product.expirationDate)}
                </td>
              </tr>
            </tbody>
          </table>
          <h1 className="title font-bold mt-3">Chi tiết sản phẩm</h1>
          <div className="custom-html-content">
            <div
              dangerouslySetInnerHTML={{
                __html: isExpanded
                  ? product.recipe
                  : `${product.recipe.slice(0, 300)}...`,
              }}
            />
            {product.recipe.length > 300 && (
              <div className="flex justify-center">
                <div>
                  <button
                    onClick={handleToggleExpand}
                    className="cursor-pointer"
                  >
                    {isExpanded ? (
                      <div className="flex items-center">
                        <>
                          Thu gọn
                          <IoIosArrowUp />
                        </>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <>
                          Xem thêm
                          <IoIosArrowDown />
                        </>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* review container */}
        <div className="border p-2 rounded-lg my-3">
          <h1 className="text-lg font-bold p-4">Đánh giá</h1>
          {currentReviews.map((review) => (
            <div key={review._id} className="border p-3 mb-3 rounded-lg">
              <div className="flex justify-between">
                <p className="font-semibold">{review.userName}</p>
              </div>
              <p className="text-xs text-grey-300">
                {formatDateTime(review.createdAt)}
              </p>
              <div>
                <span>{renderRating(review.rating)}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {user && user.uid === review.userId && (
                <div>
                  <button
                    onClick={handleToggleActions}
                    className="text-grey no-underline cursor-pointer"
                  >
                    <span className="text-sm">Thay đổi</span>
                  </button>
                  <div className="flex justify-end">
                    {showActions && (
                      <div>
                        <button
                          onClick={() => handleDeleteComment(review._id)}
                          className="text-red no-underline cursor-pointer text-sm"
                        >
                          Xóa
                        </button>
                        <button
                          onClick={() => handleEditComment(review._id)}
                          className="no-underline cursor-pointer ml-2 text-sm"
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {editReviewId === review._id && (
                <ReviewFormEdit
                  reviewId={review._id}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
            </div>
          ))}
          <Modal></Modal>
          {/* reviewFrom */}
          <div>{renderReviewFormOrMessage()}</div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-3">
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded-full ${
                  currentPage === index + 1
                    ? "bg-green text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
