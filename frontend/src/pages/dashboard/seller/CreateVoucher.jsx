import React, { useState, useEffect } from "react";
import voucherAPI from "../../../api/voucherAPI";
import AddVoucherModal from "../../../components/Voucher/AddVoucherModal";
import useUserCurrent from "../../../hooks/useUserCurrent";
import { FaCheck, FaTrash } from "react-icons/fa6";
import { Pagination } from "@mui/material";
import UpdateQuantityModal from "../../../components/Modal/UpdateQuantityModal";
import { Bounce, toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import EditVoucherModal from "../../../components/Modal/EditVoucherModal";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";

const CreateVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedVoucherForEdit, setSelectedVoucherForEdit] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [openUpdateQuantityModal, setOpenUpdateQuantityModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [voucherStatus, setVoucherStatus] = useState(null);
  const [expiredBefore, setExpiredBefore] = useState("");
  const [expiredAfter, setExpiredAfter] = useState("");
  const [voucherQuantity, setVoucherQuantity] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];
  const title = "Xóa voucher";
  const message = "Bạn có chắc muốn xóa voucher này?";
  const updateVoucherStatus = (voucher) => {
    const currentDate = new Date();
    const expiryDate = new Date(voucher.voucher_experied_date);

    if (expiryDate < currentDate) {
      return { ...voucher, voucher_status: false, expired: true };
    }
    return { ...voucher, expired: false };
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      if (!shopId) return;
      try {
        const response = await voucherAPI.getAllVoucher(shopId, {
          page: page,
          limit: itemsPerPage,
          search: searchTerm,
          status: voucherStatus,
          expiredBefore: expiredBefore,
          expiredAfter: expiredAfter,
          quantity: voucherQuantity,
        });
        const updatedVouchers = response.vouchers.map(updateVoucherStatus);
        setVouchers(updatedVouchers);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchVouchers();
  }, [
    shopId,
    page,
    itemsPerPage,
    searchTerm,
    voucherStatus,
    voucherQuantity,
    expiredBefore,
    expiredAfter,
  ]);
  const addVoucher = (newVoucher) => {
    setVouchers((prevVouchers) => [...prevVouchers, newVoucher]);
  };
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("vi-VN", options);
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) =>
    setVoucherStatus(event.target.value === "true");
  const handleExpiredBeforeChange = (event) =>
    setExpiredBefore(event.target.value);
  const handleExpiredAfterChange = (event) =>
    setExpiredAfter(event.target.value);
  const handleQuantityChange = (event) =>
    setVoucherQuantity(event.target.value);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handleUpdateQuantity = (item) => {
    setSelectedVoucher(item);
    setOpenUpdateQuantityModal(true);
  };
  const handleCloseUpdateQuantityModal = () => {
    setOpenUpdateQuantityModal(false);
    setSelectedVoucher(null);
  };
  const handleSubmitUpdateQuantity = async (data) => {
    try {
      await voucherAPI.updateQuantityVoucher(`${selectedVoucher._id}`, {
        quantity: data.quantity,
      });
      setVouchers((prevVouchers) => {
        return prevVouchers.map((voucher) =>
          voucher._id === selectedVoucher._id
            ? { ...voucher, quantity: data.quantity }
            : voucher
        );
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
      handleCloseUpdateQuantityModal();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };
  const handleEditVoucher = (voucher) => {
    setSelectedVoucherForEdit(voucher);
    setOpenEditModal(true);
  };
  const handleDeleteClick = (id) => {
    setShowConfirmModal(true);
    setVoucherToDelete(id);
  };
  const handleSubmitEditVoucher = async (updatedVoucher) => {
    try {
      await voucherAPI.updateVoucher(updatedVoucher._id, updatedVoucher);
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) =>
          voucher._id === updatedVoucher._id ? updatedVoucher : voucher
        )
      );

      toast.success("Voucher đã được cập nhật thành công!", {
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

      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Xảy ra lỗi khi cập nhật", {
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
  const confirmDeleteVoucher = () => {
    if (voucherToDelete) {
      handleDelete(voucherToDelete);
    }
  };
  const handleDelete = async (id) => {
    try {
      await voucherAPI.deleteVoucher(id);
      setShowConfirmModal(false);
      setVoucherToDelete(null);
      setVouchers((prevVouchers) =>
        prevVouchers.filter((voucher) => voucher._id !== id)
      );
      toast.success("Đánh giá đã được xóa", {
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
      toast.success("Xảy ra lỗi khi xóa đánh giá", {
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
      console.error("Failed to delete review:", error);
    }
  };
  return (
    <div className="w-full px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý khuyến mãi <span className="text-green">sản phẩm</span>
      </h2>
      <h2>Tổng số mã khuyến mãi: {vouchers.length}</h2>
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-ghost bg-green text-white ml-10 hover:bg-green hover:opacity-80"
        >
          Thêm mới Voucher
        </button>
        <AddVoucherModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          addVoucher={addVoucher}
        />
      </div>
      <div className="flex items-center my-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo mô tả voucher"
          value={searchTerm}
          onChange={handleSearchChange}
          className="input input-sm text-black"
        />
        <select
          value={voucherStatus || ""}
          onChange={handleStatusChange}
          className="select select-sm ml-2"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Không hoạt động</option>
        </select>
        <input
          type="number"
          value={voucherQuantity}
          onChange={handleQuantityChange}
          className="input input-sm text-black ml-3"
          placeholder="Số lượng"
        />
        <input
          type="date"
          value={expiredBefore}
          onChange={handleExpiredBeforeChange}
          className="input input-sm "
          placeholder="Ngày hết hạn trước"
        />
        <input
          type="date"
          value={expiredAfter}
          onChange={handleExpiredAfterChange}
          className="input input-sm"
          placeholder="Ngày hết hạn sau"
        />
      </div>
      <div></div>

      <div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="text-black border-style">
                <th>Stt</th>
                <th className="cursor">Mã voucher</th>
                <th className="cursor">Mô tả voucher</th>
                <th>Trạng thái</th>
                <th>% Giảm</th>
                <th>Ngày hết hạn</th>
                <th className="text-center">Số lượng</th>
                <th>Chỉnh sửa</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {vouchers?.map((item, index) => (
                <tr key={index} className="text-black border-gray-300">
                  <th>{index + 1}</th>
                  <td>{item.code}</td>
                  <td>{item.voucher_describe?.slice(0, 20)}...</td>
                  <td>
                    {item.voucher_status ? (
                      "Hoạt động"
                    ) : item.expired ? (
                      <span className="text-red-500">Hết hạn</span>
                    ) : (
                      "Không hoạt động"
                    )}
                  </td>
                  <td className="text-center">
                    {item.voucher_discount_persent} %
                  </td>
                  <td>{formatDateTime(item.voucher_experied_date)}</td>
                  <td className="text-center flex items-center">
                    <span className="p-2">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item)}>
                      <img
                        width={"20px"}
                        height={"10px"}
                        src="/images/Quantity.png"
                        alt=""
                      />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-xs bg-orange-500 text-white"
                      onClick={() => handleEditVoucher(item)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="bg-red btn btn-ghost btn-xs text-white"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <EditVoucherModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            onSubmit={handleSubmitEditVoucher}
            voucher={selectedVoucherForEdit}
          />
        </div>
      </div>
      {showConfirmModal && (
        <ConfirmDeleteModal
          title={title}
          message={message}
          showModal={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDeleteVoucher}
        />
      )}
      <UpdateQuantityModal
        open={openUpdateQuantityModal}
        onClose={handleCloseUpdateQuantityModal}
        onSubmit={handleSubmitUpdateQuantity}
        initialQuantity={selectedVoucher ? selectedVoucher.quantity : 1}
      />
      {totalPages > 0 && (
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
  );
};

export default CreateVoucher;
