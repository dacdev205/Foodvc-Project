import React, { useState, useEffect } from "react";
import FormattedPrice from "../../../ultis/FormatedPriece";
import { CircularProgress, Pagination } from "@mui/material";
import useMenuAdmin from "../../../hooks/useMenuAdmin";
import useUserCurrent from "../../../hooks/useUserCurrent";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";

const ManageMenuAdmin = () => {
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [page, setPage] = useState(1);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];
  const axiosSecure = useAxiosSecure();

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [menu, totalPages, refetch, isLoading, error] = useMenuAdmin(
    searchTerm,
    filterType,
    category,
    page,
    5,
    priceRange,
    ratingRange
  );

  useEffect(() => {
    refetch();
  }, [
    page,
    searchTerm,
    filterType,
    category,
    priceRange,
    ratingRange,
    refetch,
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setPage(1);
    refetch();
  };
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(":");
    console.log(field, order);

    setSortBy(field);
    setSortOrder(order);
    setPage(1);
    refetch();
  };
  const handleRemoveFromMenu = (item) => {
    setProductToRemove(item);
    setShowRemoveConfirmModal(true);
  };
  const confirmRemoveFromMenu = async () => {
    try {
      const productIdToRemove = productToRemove._id;
      const response = await axiosSecure.post(
        "/inventory/remove-from-menu-admin",
        {
          productId: productIdToRemove,
        }
      );

      if (response) {
        toast.success("Sản phẩm đã được xóa khỏi menu", {
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
        refetch();
      } else {
        toast.error("Đã xảy ra lỗi khi xóa khỏi menu", {
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
      console.error("Error removing item:", error);
    } finally {
      setShowRemoveConfirmModal(false);
      setProductToRemove(null);
    }
  };
  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">sản phẩm</span>
      </h2>
      {/* Search input */}
      <div className="flex items-center my-2">
        <input
          type="text"
          placeholder="Nhập tên sản phẩm"
          value={searchTerm}
          onChange={handleSearch}
          className="input input-sm text-black"
        />
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="select select-sm ml-2"
        >
          <option value="name">Tên sản phẩm</option>
          <option value="brand">Thương hiệu</option>
          <option value="category">Danh mục</option>
          <option value="location">Nơi sản xuất</option>
        </select>
        <select
          value={`${sortBy}:${sortOrder}`}
          onChange={handleSortChange}
          className="select select-sm ml-2"
        >
          <option value="">Sắp xếp theo</option>
          <option value="price:asc">Giá tăng dần</option>
          <option value="price:desc">Giá giảm dần</option>
          <option value="quantity:asc">Số lượng tăng dần</option>
          <option value="quantity:desc">Số lượng giảm dần</option>
        </select>
      </div>

      {/* Table display */}
      <div>
        <table className="table shadow-lg">
          <thead className="bg-green text-white">
            <tr className="border-style">
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th className="text-center">Số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : menu.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  Không có sản phẩm nào
                </td>
              </tr>
            ) : (
              menu.map((item, index) => (
                <tr key={index} className="text-black border-gray-300">
                  <th>{index + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={PF + "/" + item.productId.image} alt="" />
                      </div>
                    </div>
                  </td>
                  <td
                    className="tooltip mt-4 tooltip-bottom"
                    data-tip={item.productId.name}
                  >
                    {item.productId.name.slice(0, 20)}...
                  </td>
                  <td>
                    <FormattedPrice price={item.productId.price} />
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveFromMenu(item.productId)}
                      className={`btn btn-ghost btn-xs text-red`}
                    >
                      <FaArrowAltCircleDown />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {menu.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      )}
      <ConfirmDeleteModal
        showModal={showRemoveConfirmModal}
        onClose={() => setShowRemoveConfirmModal(false)}
        onConfirm={confirmRemoveFromMenu}
        title="Xác nhận gỡ sản phẩm khỏi menu"
        message="Bạn có chắc chắn muốn gỡ sản phẩm này khỏi menu?"
      />
    </div>
  );
};

export default ManageMenuAdmin;
