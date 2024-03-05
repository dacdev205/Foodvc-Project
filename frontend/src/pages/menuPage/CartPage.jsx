import React, { useContext, useEffect, useState } from "react";
import styles from "../../CssModule/CartnWishPage.module.css";
import useCart from "../../hooks/useCart";
import { FaTrash } from "react-icons/fa";
import cartAPI from "../../api/cartAPI";
import { AuthContext } from "../../context/AuthProvider";
import LoadingSpinner from "../../components/LoadingSpinner";
import Swal from "sweetalert2";
import menuAPI from "../../api/menuAPI";
import { Link } from "react-router-dom";
import inventoryAPI from "../../api/inventoryAPI";
import FormattedPrice from "../../components/FormatedPriece";
import paymentAPI from "../../api/paymentAPI";
const CartPage = () => {
  const [cart, refetchCart, isLoading] = useCart();
  const { user } = useContext(AuthContext);
  const PF = "https://foodvc-server.onrender.com";
  const [originalPrices, setOriginalPrices] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      const allItemIds = cart.map((item) => item._id);
      setSelectedItems(allItemIds);
    }
    setSelectAll(!selectAll);
  };
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        const updatedOriginalPrices = {};
        await Promise.all(
          cart.map(async (item) => {
            const priceOriginalData = await inventoryAPI.getProductById(
              item._id
            );
            if (priceOriginalData.applyVoucher) {
              updatedOriginalPrices[item._id] = priceOriginalData.price;
            }
          })
        );
        setOriginalPrices(updatedOriginalPrices);
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

    // Check if the part after the decimal point is greater than or equal to 5
    if (decimalPart && parseInt(decimalPart) >= 5) {
      return new Intl.NumberFormat("vi-VN", {
        currency: "VND",
      }).format(Math.ceil(price));
    }

    return priceNumber;
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
        if (updatedSelected.length === cart.length) {
          setSelectAll(true);
        }
        return updatedSelected;
      }
    });
  };

  //handleDelete(item)
  const handleDelete = async (item) => {
    try {
      await cartAPI.deleteProduct(item._id);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Food deleted on the cart.",
        showConfirmButton: false,
        timer: 700,
      });
      refetchCart();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleQuantityChange = async (item, newQuantity) => {
    try {
      if (newQuantity > 0) {
        const productInfo = await menuAPI.getProductById(item._id);
        if (item.quantity >= productInfo.quantity) {
          alert("Số lượng sản phẩm vượt quá số lượng hiện có");
        } else {
          await cartAPI.updateProduct(item._id, { quantity: newQuantity });
          refetchCart();
        }
      } else {
        await cartAPI.deleteProduct(item._id);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Sản phẩm đã bị xóa khỏi giỏ hàng.",
          showConfirmButton: false,
          timer: 700,
        });
        // Làm mới giỏ hàng sau khi xóa
        refetchCart();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
    }
  };
  //handleDecrease
  const handleDecrease = async (item) => {
    try {
      // Decrease the quantity by 1 (or adjust as needed)
      const updatedProduct = await cartAPI.updateProduct(item._id, {
        quantity: item.quantity - 1,
      });
      refetchCart();

      if (updatedProduct.quantity < 1) {
        await cartAPI.deleteProduct(item._id);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Food deleted on the cart.",
          showConfirmButton: false,
          timer: 700,
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
    const productInfo = await menuAPI.getProductById(item._id);

    if (item.quantity >= productInfo.quantity) {
      alert("Số lượng sản phẩm vượt quá số lượng hiện có");
    } else {
      await cartAPI.updateProduct(item._id, {
        quantity: item.quantity + 1,
      });
    }

    refetchCart();
  };

  //calculatePrice
  const calculatePrice = (item) => {
    if (item && item.price) {
      const totalPrice = item.price * item.quantity;
      return parseFloat(totalPrice.toFixed(2));
    }
    return 0;
  };

  const cartSubTotal = selectedItems.reduce((totalPrice, itemId) => {
    const selectedItem = cart.find((item) => item._id === itemId);
    return totalPrice + calculatePrice(selectedItem);
  }, 0);
  const orderTotal = cartSubTotal;

  const handleCheckOut = async () => {
    try {
      await paymentAPI.postProductToPayment({
        email: user.email,
        products: cart.filter((item) => selectedItems.includes(item._id)),
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
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="text-center px-4 space-y-7">
              {/* content */}
              {cart.length ? (
                <h2 className="md:text-3xl text-2xl font-bold md:leading-snug leading-snug text-black">
                  Sản phẩm trong <span className="text-green">giỏ hàng</span>
                </h2>
              ) : (
                <div>
                  <h2 className="md:text-2xl text-1xl font-bold md:leading-snug leading-snug mb-3 text-black">
                    Chưa có sản phẩm trong{" "}
                    <span className="text-green">giỏ hàng</span>
                  </h2>
                  <div>
                    <Link to="/menu">
                      <button className="btn bg-green text-white">
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
        {cart.length ? (
          <div>
            {/* PC devices */}
            <div className="overflow-x-auto">
              <table className="hidden md:table">
                {/* head */}
                <thead className="bg-green text-white rounded-sm ">
                  <tr className="text-white">
                    <th>
                      <div className="flex ">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                          className=" "
                        />{" "}
                        <span>Sản phẩm</span>
                      </div>
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
                  {cart.map((item, index) => (
                    <tr key={index} className="text-black">
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleItemSelection(item._id)}
                          className="text-white"
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <Link
                              to={`/product/${item._id}`}
                              className="mask mask-squircle w-12 h-12"
                            >
                              <img src={PF + "/" + item.image} alt="product" />
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="">{item.name.slice(0, 30)}... </div>
                      </td>
                      <td className="text-center">
                        <div>
                          <button
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black"
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
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <FormattedPrice price={calculatePrice(item)} />
                        {originalPrices[item._id] && (
                          <span className="flex text-gray-600 line-through text-sm">
                            {formattedPrice(originalPrices[item._id])}
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
                    className="btn bg-green text-white px-5 w-full"
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
                  <div className="mb-8">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />{" "}
                    <span className="text-black">Chọn toàn bộ</span>
                  </div>
                  <button
                    className="btn btn-sm bg-slate-200 text-black hover:bg-slate-300"
                    onClick={handleEditClick}
                  >
                    {isEditing ? "Xong" : "Sửa"}
                  </button>
                </div>
                {cart.map((item, index) => (
                  <div className={styles.cartItemWrapper} key={index}>
                    <div
                      className={`${styles.cartItem} ${
                        isEditing ? styles.editing : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleItemSelection(item._id)}
                        className={styles.selectCheckbox}
                      />
                      <div className={styles.cartItemImage}>
                        <Link to={`/product/${item._id}`}>
                          <img src={PF + "/" + item.image} alt="product" />
                        </Link>
                      </div>
                      <div className={styles.cartItemDetails}>
                        <div className={styles.cartItemName}>
                          {item.name.slice(0, 20)}...
                        </div>
                        <div className="text-black">
                          {/* <FormattedPrice price={calculatePrice(item)} /> */}
                          {originalPrices[item._id] && (
                            <span className="original-price">
                              {formattedPrice(originalPrices[item._id])}
                            </span>
                          )}
                        </div>
                        <div>
                          <button
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black"
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
                            className="btn btn-xs bg-slate-200 hover:bg-slate-300 text-black"
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
                      <p className="text-lg text-black">
                        Tổng thanh toán ({selectedItems.length} Sản phẩm):{" "}
                      </p>
                      <FormattedPrice
                        className="text-green text-lg"
                        price={orderTotal.toFixed(2)}
                      />
                    </div>
                    <Link to={"/check-out"}>
                      <button
                        className="btn bg-green text-white px-5 w-full hover:bg-green hover:opacity-80"
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
