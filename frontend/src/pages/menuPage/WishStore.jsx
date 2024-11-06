import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaTrash } from "react-icons/fa";
import LoadingSpinner from "../../ultis/LoadingSpinner";
import useWishStore from "../../hooks/useWishStore";
import styles from "../../CssModule/CartnWishPage.module.css";
import wishListAPI from "../../api/wishListAPI";
import { Bounce, toast } from "react-toastify";
import useUserCurrent from "../../hooks/useUserCurrent";

const WishStorePage = () => {
  const [wishStores, refetchWishStore, isLoading] = useWishStore();
  const PF = "http://localhost:3000";
  const userData = useUserCurrent();

  const handleDelete = async (item) => {
    try {
      const res = await wishListAPI.deleteStore({
        userId: userData._id,
        shopId: item.shop._id,
      });

      toast.info("Xóa cửa hàng yêu thích thành công.", {
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
      refetchWishStore();
    } catch (error) {
      toast.error("Xóa cửa hàng yêu thích thất bại", {
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
      console.error("Error deleting store:", error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-full lg:w-[890px] md:w-full sm:w-full shadow-md rounded-sm bg-white p-5">
      <div className="py-24 flex flex-col items-center justify-center">
        <div className="text-center px-4 space-y-7">
          {wishStores.length ? (
            <h2 className="md:text-3xl text-2xl font-bold text-black">
              Cửa hàng <span className="text-green">yêu thích</span>
            </h2>
          ) : (
            <h2 className="md:text-2xl text-1xl font-bold mb-3 text-black">
              Chưa có cửa hàng <span className="text-green">yêu thích</span>
            </h2>
          )}
        </div>
      </div>

      {wishStores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="hidden md:table text-center border w-[850px]">
            <thead className="bg-green text-white">
              <tr className="text-white">
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Tên cửa hàng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {wishStores?.map((item, index) => (
                <tr key={index} className={styles.styleBordered}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/shop-detail/${item?.shop?._id}`}>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img
                            src={`${PF}/${item?.shop?.shop_image}`}
                            alt="store"
                          />
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>{item?.shop?.shopName}</td>

                  <td>
                    {item?.shop?.shop_isOpen ? (
                      <span className="text-green-600">Đang mở cửa</span>
                    ) : (
                      <span className="text-red-600">Đóng cửa</span>
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
      ) : (
        <div className="text-center py-8">
          <p>Chưa có cửa hàng yêu thích.</p>
        </div>
      )}
    </div>
  );
};

export default WishStorePage;
