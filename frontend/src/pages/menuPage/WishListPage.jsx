import React, { useContext, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import wishListAPI from "../../api/wishListAPI";
import LoadingSpinner from "../../ultis/LoadingSpinner";
import useWishList from "../../hooks/useWishList";
import { Link } from "react-router-dom";
import FormattedPrice from "../../ultis/FormatedPriece";
import styles from "../../CssModule/CartnWishPage.module.css";

const WishListPage = () => {
  const [wishList, refetchWishList, isLoading] = useWishList();
  const PF = "http://localhost:3000";
  const [heartFilledIds, setHeartFilledIds] = useState(
    JSON.parse(localStorage.getItem("heartFilledIds")) || []
  );
  //handleDelete(item)
  const handleDelete = async (item) => {
    try {
      await wishListAPI.deleteProduct(item._id);
      setHeartFilledIds((prevIds) =>
        prevIds.filter((id) => id !== item.product._id)
      );

      const updatedHeartFilledIds = heartFilledIds.filter(
        (id) => id !== item.product._id
      );
      localStorage.setItem(
        "heartFilledIds",
        JSON.stringify(updatedHeartFilledIds)
      );
      refetchWishList();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="section-container">
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
          <div className="py-24 flex flex-col items-center justify-center">
            <div className=" text-center px-4 space-y-7">
              {wishList?.length ? (
                <h2 className="md:text-3xl text-2xl font-bold md:leading-snug leading-snug text-black">
                  Sản phẩm <span className="text-green">yêu thích</span>
                </h2>
              ) : (
                <div>
                  <h2 className="md:text-2xl text-1xl font-bold md:leading-snug leading-snug mb-3 text-black">
                    Chưa có sản phẩm{" "}
                    <span className="text-green">yêu thích</span>
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
        {/* table for the wishlist */}
        {wishList?.length ? (
          <div>
            <div className="overflow-x-auto">
              <table className="hidden md:table text-center border">
                {/* head */}
                <thead className="bg-green text-white rounded-sm ">
                  <tr className="text-white border-style">
                    <th>#</th>
                    <th>Hình ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {/* row 1 */}
                  {wishList.map((item, index) => (
                    <tr key={index} className={styles.styleBordered}>
                      <td>{index + 1}</td>
                      <td>
                        <Link to={`/product/${item._id}`}>
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <img
                                src={PF + "/" + item?.product.image}
                                alt="product"
                              />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td>
                        <div className="">{item?.product.name}</div>
                      </td>
                      <td>
                        <FormattedPrice price={item?.product.price} />
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

            {/* Mobile Devices */}
            <div className="md:hidden mobile-cart-items-container">
              {wishList.map((item, index) => (
                <div className="flex justify-between" key={index}>
                  <div className="cart-item flex py-3 ">
                    <div className="p-3 text-black">{index + 1} </div>
                    <div className="avatar hover:scale-105 transition-all duration-200 mr-3">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="mask mask-squircle w-12 h-12"
                      >
                        <img
                          src={PF + "/" + item.product.image}
                          alt="product"
                        />
                      </Link>
                    </div>
                    <div className="cart-item-details">
                      <div className="cart-item-name text-black">
                        {item.product.name.slice(0, 20)}...
                      </div>
                      <FormattedPrice price={item.product.price} />
                    </div>
                  </div>
                  <div className="text-center flex align-center">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item)}
                    >
                      <FaTrash className="text-red"></FaTrash>
                    </button>
                  </div>
                </div>
              ))}
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

export default WishListPage;
