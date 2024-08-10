import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import inventoryAPI from "../../../api/inventoryAPI";
import menuAPI from "../../../api/menuAPI";
import useInventory from "../../../hooks/useInventory";
import { Pagination } from "@mui/material";

import FormattedPrice from "../../../ultis/FormatedPriece";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import TransferToMenuModal from "../../../components/Modal/TransferToMenuModal";
import UpdateQuantityModal from "../../../components/Modal/UpdateQuantityModal";
import { Bounce, toast } from "react-toastify";
const ManageInventory = () => {
  const PF = "http://localhost:3000";

  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("name");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openUpdateQuantityModal, setOpenUpdateQuantityModal] = useState(false);
  const [inventory, totalPages, refetch] = useInventory(
    searchTerm,
    filterType,
    page,
    5,
    sortBy,
    sortOrder
  );
  useEffect(() => {
    refetch();
  }, [page, searchTerm, filterType, refetch]);
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    refetch();
  };
  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
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
  const handleTransferToMenu = (item) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
  };

  const handleUpdateQuantity = (item) => {
    setSelectedProduct(item);
    setOpenUpdateQuantityModal(true);
  };

  const handleCloseUpdateQuantityModal = () => {
    setOpenUpdateQuantityModal(false);
    setSelectedProduct(null);
  };

  const handleSubmitTransfer = async (data) => {
    try {
      const response = await axiosSecure.post("/inventory/transfer-to-menu", {
        productId: selectedProduct._id,
        quantity: data.quantity,
      });

      if (response.data.message === "Product transferred successfully") {
        toast.success("Sản phẩm đã được đưa lên menu", {
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
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error transferring item:", error);
    }
  };

  const handleSubmitUpdateQuantity = async (data) => {
    try {
      await menuAPI.updateQuantityProduct(`${selectedProduct._id}`, {
        quantity: data.quantity,
      });

      toast.success("Số lượng đã được cập nhật", {
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
      handleCloseUpdateQuantityModal();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveFromMenu = (item) => {
    setProductToRemove(item);
    setShowRemoveConfirmModal(true);
  };

  const confirmRemoveFromMenu = async () => {
    try {
      const productIdToRemove = productToRemove._id;
      const response = await axiosSecure.post("/inventory/remove-from-menu", {
        productId: productIdToRemove,
      });

      if (response.data.message === "Product removed from menu successfully") {
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

  const handleDeleteItem = async (item) => {
    const res = await inventoryAPI.deleteProductById(item._id);
    setShowConfirmModal(false);
    setProductToDelete(null);
    if (res) {
      refetch();
    }
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      handleDeleteItem(productToDelete);
    }
  };

  return (
    <div className="w-full md:w-[900px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">sản phẩm trong kho</span>
      </h2>
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
      <div>
        <div className="">
          <table className="table">
            <thead>
              <tr className="text-black border-style">
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th className="text-center">Số lượng tồn kho</th>
                <th className="text-center">Chỉnh sửa</th>
                <th className="">Xóa</th>
                <th className="text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={index} className="boder border-gray-300">
                  <th className="text-black">{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={PF + "/" + item.image} alt="" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className="text-black tooltip mt-4 tooltip-bottom "
                    data-tip={item.name}
                  >
                    {item.name.slice(0, 20)}...
                  </td>
                  <td>
                    <FormattedPrice price={item.price} />
                  </td>
                  <td className="text-center text-black">{item.quantity}</td>
                  <td className="text-center">
                    <Link to={`/admin/update-item/${item._id}`}>
                      <button className="btn btn-ghost btn-xs bg-orange-500 text-white">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="btn btn-ghost btn-xs text-red"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                  <td className="text-center">
                    {item.transferredToMenu ? (
                      <div className="flex justify-center">
                        <button onClick={() => handleUpdateQuantity(item)}>
                          <img
                            width={"20px"}
                            height={"10px"}
                            src="/images/Quantity.png"
                            alt=""
                          />
                        </button>
                        <button
                          onClick={() => handleRemoveFromMenu(item)}
                          className={`btn btn-ghost btn-xs text-red`}
                        >
                          <FaArrowAltCircleDown />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTransferToMenu(item)}
                        className="btn btn-ghost btn-xs text-green"
                      >
                        <FaArrowAltCircleUp />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TransferToMenuModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmitTransfer}
          />
          <UpdateQuantityModal
            open={openUpdateQuantityModal}
            onClose={handleCloseUpdateQuantityModal}
            onSubmit={handleSubmitUpdateQuantity}
            initialQuantity={selectedProduct ? selectedProduct.quantity : 1}
          />
          <ConfirmDeleteModal
            showModal={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={confirmDeleteProduct}
            title="Xác nhận xóa sản phẩm"
            message="Bạn có chắc chắn muốn xóa sản phẩm này?"
          />
          <ConfirmDeleteModal
            showModal={showRemoveConfirmModal}
            onClose={() => setShowRemoveConfirmModal(false)}
            onConfirm={confirmRemoveFromMenu}
            title="Xác nhận gỡ sản phẩm khỏi menu"
            message="Bạn có chắc chắn muốn gỡ sản phẩm này khỏi menu?"
          />
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="success"
        />
      </div>
    </div>
  );
};

export default ManageInventory;
