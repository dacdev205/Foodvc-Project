import React, { useEffect, useState } from "react";
import styles from "../../CssModule/CartnWishPage.module.css";
import useCart from "../../hooks/useCart";
import { FaTrash } from "react-icons/fa";
import cartAPI from "../../api/cartAPI";
import LoadingSpinner from "../../ultis/LoadingSpinner";
import menuAPI from "../../api/menuAPI";
import { Link } from "react-router-dom";
import inventoryAPI from "../../api/inventoryAPI";
import FormattedPrice from "../../ultis/FormatedPriece";
import { FaCheck } from "react-icons/fa6";
import paymentAPI from "../../api/paymentAPI";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import useUserCurrent from "../../hooks/useUserCurrent";
const CartPage = () => {
  const [cart, refetchCart, isLoading] = useCart();
  const userData = useUserCurrent();
  const PF = "http://localhost:3000";
  const [originalPrices, setOriginalPrices] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItemIds = cart.products.map((item) => item.productId._id);
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const fetchProductList = async () => {
      try {
        if (cart && Array.isArray(cart.products)) {
          const updatedOriginalPrices = {};
          await Promise.all(
            cart.products.map(async (item) => {
              if (item.productId && item.productId._id) {
                const priceOriginalData = await inventoryAPI.getProductById(
                  item.productId._id
                );
                if (priceOriginalData && priceOriginalData.applyVoucher) {
                  updatedOriginalPrices[item.productId._id] =
                    priceOriginalData.price;
                }
              }
            })
          );
          setOriginalPrices(updatedOriginalPrices);
        }
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };

    fetchProductList();
  }, [cart]);

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

  //handleDelete(item)
  const handleDelete = async (item) => {
    try {
      await cartAPI.deleteProduct(cart._id, item.productId._id);
      refetchCart();
      toast.success("Sản phẩm đã được xóa!", {
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
      toast.error("Lỗi khi xóa sản phẩm!", {
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
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleQuantityChange = async (item, newQuantity) => {
    try {
      if (newQuantity > 0) {
        const productInfo = await menuAPI.getProductById(item.productId._id);
        if (item.quantity >= productInfo.quantity) {
          toast.warn("Số lượng vượt quá hiện có!", {
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
          await cartAPI.updateProduct(item.productId._id, {
            quantity: newQuantity,
          });
          refetchCart();
        }
      } else {
        await cartAPI.deleteProduct(item.productId._id);
        toast.info("Sản phẩm đã được xóa!", {
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
        refetchCart();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    }
  };
  //handleDecrease
  const handleDecrease = async (item) => {
    try {
      const updatedProduct = await cartAPI.updateProduct(
        cart._id,
        item.productId._id,
        {
          quantity: item.quantity - 1,
        }
      );
      refetchCart();
      if (updatedProduct.quantity < 1) {
        await cartAPI.deleteProduct(item.productId._id);
        toast.warn("Số lượng vượt quá hiện có!", {
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
        refetchCart();
      } else {
        return;
      }
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
    }
  };

  //handleIncrease
  const handleIncrease = async (item) => {
    const productInfo = await menuAPI.getProductById(item.productId._id);

    if (item.quantity >= productInfo.quantity) {
      alert("Số lượng sản phẩm vượt quá số lượng hiện có");
    } else {
      await cartAPI.updateProduct(cart._id, item.productId._id, {
        quantity: item.quantity + 1,
      });
    }

    refetchCart();
  };

  //calculatePrice
  const calculatePrice = (item) => {
    if (item && item.productId.price) {
      const totalPrice = item.productId.price * item.quantity;
      return parseFloat(totalPrice.toFixed(2));
    }
    return 0;
  };
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(itemId)) {
        const updatedSelected = prevSelected.filter((id) => id !== itemId);
        if (updatedSelected.length === 0) {
          setSelectAll(false);
        }
        return updatedSelected;
      } else {
        const updatedSelected = [...prevSelected, itemId];
        if (updatedSelected.length === cart?.products?.length) {
          setSelectAll(true);
        }
        return updatedSelected;
      }
    });
  };
  const cartSubTotal = selectedItems.reduce((totalPrice, itemId) => {
    const selectedItem = cart.products.find(
      (item) => item.productId._id === itemId
    );
    return totalPrice + calculatePrice(selectedItem);
  }, 0);
  const orderTotal = cartSubTotal;

  const handleCheckOut = async () => {
    try {
      await paymentAPI.postProductToPayment({
        userId: userData._id,
        products: cart.products.filter((item) =>
          selectedItems.includes(item.productId._id)
        ),
      });
    } catch (error) {
      console.error("Error during check-out:", error);
    }
    refetchCart();
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  } else {
    // Render cart page with database load succesfully
    return (
      <div className="section-container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition:Bounce
        />
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="text-center px-4 space-y-7">
              {/* content */}
              {cart?.products?.length ? (
                <h2 className="md:text-3xl text-2xl font-bold md:leading-snug leading-snug text-black">
                  Sản phẩm trong <span className="text-green">giỏ hàng</span>
                </h2>
              ) : (
                <div>
                  <img src="./public/images/home/cartBanner.png" alt="" />
                  <h2 className="md:text-2xl text-1xl font-bold md:leading-snug leading-snug mb-3 text-black">
                    Chưa có sản phẩm trong{" "}
                    <span className="text-green">giỏ hàng</span>
                  </h2>
                  <div>
                    <Link to="/menu">
                      <button className="btn bg-green text-white border-style hover:bg-green hover:opacity-80">
                        Tiếp tục mua sắm
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* table for the cart */}
        {cart?.products?.length ? (
          <div>
            {/* PC devices */}
            <div className="overflow-x-auto">
              <table className="hidden md:table border">
                {/* head */}
                <thead className="bg-green text-white rounded-sm ">
                  <tr className="text-white border-style">
                    <th>
                      <label
                        className="relative cursor-pointer"
                        htmlFor="checkbox-all"
                      >
                        <input
                          type="checkbox"
                          checked={selectAll}
                          id="checkbox-all"
                          onChange={toggleSelectAll}
                          className="appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        />{" "}
                        {selectAll && (
                          <FaCheck className="absolute top-[-1px] left-[1px] text-green" />
                        )}
                        <span>Sản phẩm</span>
                      </label>
                    </th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody className="">
                  {/* row 1 */}
                  {cart.products.map((item) => (
                    <tr
                      key={item.productId._id}
                      className={styles.styleBordered}
                    >
                      <td>
                        <label
                          htmlFor={`check-box-${item.productId._id}`}
                          className="cursor-pointer relative"
                        >
                          <input
                            type="checkbox"
                            id={`check-box-${item.productId._id}`}
                            checked={selectedItems.includes(item.productId._id)}
                            onChange={() =>
                              toggleItemSelection(item.productId._id)
                            }
                            className="appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          />
                          <FaCheck
                            className={`absolute top-0 left-[1px] text-green ${
                              selectedItems.includes(item?.productId?._id)
                                ? "text-opacity-100"
                                : "text-opacity-0"
                            } check-${item?.productId?._id} transition`}
                          />
                        </label>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar hover:">
                            <Link
                              to={`/product/${item.productId._id}`}
                              className="mask mask-squircle w-12 h-12"
                            >
                              <img
                                src={PF + "/" + item.productId.image}
                                alt="product"
                              />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{item.productId.name.slice(0, 30)}...</div>{" "}
                        {/* Use item.productId.name here */}
                      </td>
                      <td className="text-center">
                        <div>
                          <button
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black border-none"
                            onClick={() => handleDecrease(item)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-10 mx-2 text-center overflow-hidden appearance-none"
                          />
                          <button
                            onClick={() => handleIncrease(item)}
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black border-none"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <FormattedPrice price={calculatePrice(item)} />
                        {originalPrices[item.productId._id] && (
                          <span className="flex text-gray-600 line-through text-sm">
                            {formattedPrice(originalPrices[item.productId._id])}
                          </span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-ghost text-red btn-xs"
                          onClick={() => handleDelete(item)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="hidden md:flex my-12 flex-col md:flex-row justify-end ">
              <div className="md:w-2/2 space-y-3">
                <div className="flex items-center">
                  <p className="text-lg text-black">
                    Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
                  </p>
                  <FormattedPrice price={orderTotal.toFixed(2)} />
                </div>
                <Link to={"/check-out"}>
                  <button
                    className="btn bg-green text-white px-5 w-full hover:bg-green hover:opacity-80 border-none"
                    disabled={selectedItems.length === 0}
                    onClick={handleCheckOut}
                  >
                    Mua hàng
                  </button>
                </Link>
              </div>
            </div>
            {/* End PC devices */}

            {/* Mobile Devices */}
            <div className="md:hidden">
              <div className={styles.mobileCartItemsContainer}>
                <div className="flex justify-between">
                  <label
                    className="relative cursor-pointer mb-8"
                    htmlFor="checkbox-all"
                  >
                    <input
                      type="checkbox"
                      checked={selectAll}
                      id="checkbox-all"
                      onChange={toggleSelectAll}
                      className="appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    />{" "}
                    {selectAll && (
                      <FaCheck className="absolute top-0 left-[1px] text-green" />
                    )}
                    <span>Sản phẩm</span>
                  </label>
                  <button
                    className="btn btn-sm bg-slate-200 text-black hover:bg-slate-300 border-none "
                    onClick={handleEditClick}
                  >
                    {isEditing ? "Xong" : "Sửa"}
                  </button>
                </div>
                {cart?.products.map((item, index) => (
                  <div className={styles.cartItemWrapper} key={index}>
                    <div
                      className={`${styles.cartItem} ${
                        isEditing ? styles.editing : ""
                      }`}
                    >
                      <label
                        htmlFor={`check-box-${index}`}
                        className="cursor-pointer relative mr-1"
                      >
                        <input
                          type="checkbox"
                          id={`check-box-${index}`}
                          checked={selectedItems.includes(item.productId_id)}
                          onChange={() =>
                            toggleItemSelection(item.productId._id)
                          }
                          className="appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        />
                        <FaCheck
                          className={`absolute top-0 left-[1px] text-green ${
                            selectedItems.includes(item.productId._id)
                              ? "text-opacity-100"
                              : "text-opacity-0"
                          } check-1 transition`}
                        />
                      </label>
                      <div className={styles.cartItemImage}>
                        <Link to={`/product/${item.productId._id}`}>
                          <img
                            src={PF + "/" + item.productId.image}
                            alt="product"
                          />
                        </Link>
                      </div>
                      <div className={styles.cartItemDetails}>
                        <div className={styles.cartItemName}>
                          {item.productId.name.slice(0, 20)}...
                        </div>
                        <div className="text-black">
                          <FormattedPrice price={calculatePrice(item)} />
                          {originalPrices[item.productId._id] && (
                            <span className="original-price">
                              {formattedPrice(
                                originalPrices[item.productId._id]
                              )}
                            </span>
                          )}
                        </div>
                        <div>
                          <button
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black border-none"
                            onClick={() => handleDecrease(item)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-10 mx-2 text-center overflow-hidden appearance-none text-black"
                          />
                          <button
                            onClick={() => handleIncrease(item)}
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black border-none"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.cartItemButtons} ${
                        isEditing ? styles.editing : ""
                      }`}
                    >
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(item)}
                      >
                        <FaTrash></FaTrash>
                      </button>
                    </div>
                  </div>
                ))}
                <div className={styles.checkoutContainer}>
                  <div className="md:w-2/2 space-y-3">
                    <div className="flex items-center">
                      <p className="md:text-lg text-black text-sm">
                        Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
                      </p>
                      <FormattedPrice
                        className="text-green text-lg"
                        price={orderTotal.toFixed(2)}
                      />
                    </div>
                    <Link to={"/check-out"}>
                      <button
                        className="btn bg-green text-white px-5 w-full hover:bg-green hover:opacity-80 border-style"
                        disabled={selectedItems.length === 0}
                        onClick={handleCheckOut}
                      >
                        Mua hàng
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/*End Mobile Devices */}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
};

export default CartPage;
