/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useOutletContext,
} from "react-router-dom";
import styles from "../../CssModule/CardDetails.module.css";
import menuAPI from "../../api/menuAPI";
import reviewAPI from "../../api/reviewAPI";
import ReviewForm from "../Reviews/ReviewForm";
import cartAPI from "../../api/cartAPI";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaStar, FaRegStar, FaStarHalf, FaRocketchat } from "react-icons/fa";
import { useForm } from "react-hook-form";
import inventoryAPI from "../../api/inventoryAPI";
import useCart from "../../hooks/useCart";
import ReviewFormEdit from "../Reviews/ReviewFormEdit";
import paymentAPI from "../../api/paymentAPI";
import orderAPI from "../../api/orderAPI";
import Modal from "../Account/Modal";
import LoadingSpinner from "../../ultis/LoadingSpinner";
import { AuthContext } from "../../context/AuthProvider";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import useUserCurrent from "../../hooks/useUserCurrent";
import { CiShop } from "react-icons/ci";
import conversationAPI from "../../api/conversationAPI";

const CardDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const PF = "http://localhost:3000";
  const { reset } = useForm();
  const [, setRating] = useState(0);
  const [quantityDefault, setQuantity] = useState(1);
  const [isExpanded, setExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [priceOrginals, setPrices] = useState([]);
  const [cart, refetchCart] = useCart();
  const context = useOutletContext();
  const toggleContactAdmin = context ? context.toggleContactAdmin : () => {};
  const [shopId, setShopId] = useState(null);
  const [editReviewId, setEditReviewId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();
  const userData = useUserCurrent();

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
        setShopId(response.shopId._id);
        setProduct(response);
        const reviewsData = await reviewAPI.getProductById(id);
        setReviews(reviewsData);
      } catch (error) {
        if (!userData?._id) {
          return;
        }
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductDetail();
  }, [id]);
  const openDeleteModal = useCallback((review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  }, []);

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
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async (product) => {
    if (user && user?.email) {
      const cartItem = {
        userId: userData?._id,
        productId: product?.productId?._id,
        quantity: quantityDefault,
      };

      try {
        await cartAPI.postToCart(cartItem);
        refetchCart();
        toast.success("Thêm vào giỏ hàng thành công!", {
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
    } else {
      document.getElementById("modal-login").showModal();
    }
    refetchCart();
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const userOrdersResponse = await orderAPI.getUserOrders(userData._id);
      const userOrders = userOrdersResponse.orders;
      console.log(userOrders);

      if (!Array.isArray(userOrders)) {
        throw new Error("Expected userOrders to be an array.");
      }

      let productFound = false;

      userOrders.forEach((userOrder) => {
        if (userOrder.statusId.name === "Completed") {
          userOrder.products.forEach((productOrder) => {
            if (
              productOrder.productId._id.toString() ===
              product.productId._id.toString()
            ) {
              productFound = true;
            }
          });
        }
      });

      if (!productFound) {
        toast.error("Chỉ được đánh giá sản phẩm khi đã trải nghiệm.", {
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
        return;
      } else {
        console.log("Product found in eligible order.");
      }
    } catch (error) {
      console.error("Error handling review submission:", error);
    }

    // Proceed with adding the review
    toast.success("Cảm ơn bạn đã gửi đánh giá!", {
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

    await reviewAPI.addReview({
      ...reviewData,
      userId: userData._id,
    });

    const updatedReviews = await reviewAPI.getProductById(id);
    setReviews(updatedReviews);
    reset();
  };

  const updateReviews = async () => {
    const updatedReviews = await reviewAPI.getProductById(id);
    setReviews(updatedReviews);
  };
  const renderReviewFormOrMessage = () => {
    return <ReviewForm productId={product._id} onSubmit={handleReviewSubmit} />;
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
        userId: userData?._id,
        totalAmount: product.productId.price * quantityDefault,
        products: {
          productId: product.productId._id,
          shopId: product.productId.shopId,
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
        <LoadingSpinner />
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
  const handleContactSeller = async () => {
    const senderId = userData._id;
    const receiverId = shopId;

    try {
      const conversations = await conversationAPI.getConversationsByUserId(
        senderId
      );

      const existingConversation = conversations.find(
        (conv) =>
          conv.members.includes(senderId) && conv.members.includes(receiverId)
      );

      if (existingConversation) {
        toggleContactAdmin();
      } else {
        await conversationAPI.createConversation({ senderId, receiverId });
        toggleContactAdmin();
      }
    } catch (error) {
      console.error("Error checking or creating conversation:", error);
    }
  };
  return (
    <div className="section-container ">
      <div className="max-w-screen-2xl container mx-auto xl:px-28 px-4 text-black">
        <div className="py-3 max-w-7xl m-auto">
          <div className="mt-6 sm:mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 sm:grid:cols-2 gap-6 h-max">
              <div className="relative">
                <img
                  src={PF + "/" + product.productId.image}
                  alt=""
                  className="w-full"
                />
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
                <h1 className="title">
                  {product.productId.name.slice(0, 30)}...
                </h1>
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
                  {formattedPrice(product.productId.price)}
                  <span>₫</span>
                </p>

                {/* quantity */}
                <div>
                  <span>Số lượng: </span>
                  <button
                    className="btn btn-xs text-black bg-slate-200 hover:bg-slate-300 border-style"
                    onClick={() => handleDecrease()}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantityDefault}
                    onChange={handleInputChange}
                    className="valueQuantity w-10 mx-2 text-center overflow-hidden appearance-none "
                  />
                  <button
                    onClick={() => handleIncrease()}
                    className="btn btn-xs text-black bg-slate-200 hover:bg-slate-300 border-style"
                  >
                    +
                  </button>
                  <span className="ml-3 text-slate-600 text-sm">
                    {product.quantity} sản phẩm có sẵn
                  </span>
                </div>
                <button
                  className={`btn bg-green text-white hover:bg-green hover:opacity-80 border-style ${
                    product.quantity === 0 ? "disabled" : ""
                  }`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                >
                  Thêm vào giỏ hàng
                </button>
                <button
                  className={`mt-10 ml-3 btn bg-green text-white hover:bg-green hover:opacity-80 border-style ${
                    product.quantity === 0 ? "disabled" : ""
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
                <td className="border p-2 text-gray-500">
                  {product.productId.brand}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Loại sản phẩm:</td>
                <td className="border p-2 text-gray-500">
                  {product?.productId?.category}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Ngày sản xuất:</td>
                <td className="border p-2 text-gray-500">
                  {formatDateTimeProductCreate(product.productId.createdAt)}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Hướng dẫn sử dụng:</td>
                <td className="border p-2 text-gray-500">
                  {product.productId.instructions}
                </td>
              </tr>
              <tr>
                <td className="border p-2">Hạn sử dụng:</td>
                <td className="border p-2 text-gray-500">
                  {formatDateTimeProductCreate(
                    product.productId.expirationDate
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center my-5">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12 mr-1">
                <img src={PF + "/" + product.shopId.shop_image} alt="product" />
              </div>
            </div>
            <div className="mx-2">
              <h1 className="text-lg font-semibold">
                {product.shopId.shopName}
              </h1>
              <div className="flex">
                <button
                  onClick={handleContactSeller}
                  className="flex items-center text-green p-2 rounded-md border-green border mr-2"
                >
                  <FaRocketchat />
                  Chat ngay
                </button>
                <Link
                  to={`/shop-detail/${product.shopId._id}`}
                  className="flex items-center text-blue-400 p-2 rounded-md border-indigo-300 border"
                >
                  <CiShop />
                  Xem shop
                </Link>
              </div>
            </div>
          </div>
          <h1 className="title font-bold mt-3">Chi tiết sản phẩm</h1>
          <div className={styles.customContentCardDetail}>
            <div
              dangerouslySetInnerHTML={{
                __html: isExpanded
                  ? product.productId.recipe
                  : `${product.productId.recipe.slice(0, 300)}...`,
              }}
            />
            {product.productId.recipe.length > 300 && (
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
                <p className="font-semibold">{review.userId.name}</p>
              </div>
              <p className="text-xs text-grey-300">
                {formatDateTime(review.createdAt)}
              </p>
              <div>
                <span>{renderRating(review.rating)}</span>
              </div>
              <p className="text-gray-700">{review.comment}</p>
              {userData?._id === review?.userId?._id && (
                <div>
                  {review.isEdited === false ? (
                    <button
                      onClick={handleToggleActions}
                      className="text-grey no-underline cursor-pointer"
                    >
                      <span className="text-sm">Thay đổi</span>
                    </button>
                  ) : (
                    ""
                  )}
                  <div className="flex justify-end">
                    {showActions && (
                      <div>
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
                  updateReviews={updateReviews}
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
