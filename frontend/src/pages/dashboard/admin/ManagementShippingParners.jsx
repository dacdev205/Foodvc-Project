import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaSearch, FaTrash } from "react-icons/fa";
import { CircularProgress, Pagination } from "@mui/material";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bounce, toast } from "react-toastify";

const EditShippingPartnerModal = React.lazy(() =>
  import("../../../components/Modal/EditShippingPartnerModal")
);
const AddShippingPartnerModal = React.lazy(() =>
  import("../../../components/Modal/AddShippingPartnerModal")
);
const ManagementShippingPartners = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addShippingPartnerModalOpen, setAddShippingPartnerModalOpen] =
    useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [shippingPartnerToDelete, setShippingPartnerToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [editShippingPartnerModalOpen, setEditShippingPartnerModalOpen] =
    useState(false);
  const [shippingPartnerToEdit, setShippingPartnerToEdit] = useState(null);

  const {
    data: partners = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shippingPartners", page, search],
    queryFn: async () => {
      const res = await axiosSecure.get("/shipping-partners", {
        params: { page, limit: 5, search },
      });
      setTotalPages(res.data.totalPages);
      return res.data.partners;
    },
  });

  const handleEditClick = (partner) => {
    setShippingPartnerToEdit(partner);
    setEditShippingPartnerModalOpen(true);
  };

  const handleEditShippingPartner = async (updatedPartner) => {
    try {
      await axiosSecure.put(
        `/shipping-partners/${updatedPartner._id}`,
        updatedPartner
      );
      toast.success("Cập nhật đối tác vận chuyển thành công!", {
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
      setEditShippingPartnerModalOpen(false);
      setShippingPartnerToEdit(null);
      refetch();
    } catch (error) {
      toast.error("Cập nhật đối tác vận chuyển thất bại!", {
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

  const handleAddShippingPartner = async (partnerData) => {
    try {
      await axiosSecure.post("/shipping-partners", partnerData);
      toast.success("Thêm đối tác vận chuyển thành công!", {
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
      setAddShippingPartnerModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm đối tác vận chuyển thất bại!", {
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

  const handleDelete = async () => {
    if (shippingPartnerToDelete) {
      try {
        await axiosSecure.delete(
          `/shipping-partners/${shippingPartnerToDelete._id}`
        );
        toast.success("Xóa đối tác vận chuyển thành công!", {
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
        setShowConfirmModal(false);
        setShippingPartnerToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Xóa đối tác vận chuyển thất bại!", {
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
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">đối tác vận chuyển</span>
      </h2>
      <div className="flex my-2 items-center">
        <FaSearch className="ml-3 text-black" />
        <input
          type="text"
          className="input input-sm input-bordered"
          placeholder="Tìm theo tên / mô tả"
          value={search}
          onChange={handleSearchChange}
        />
        <button
          className="ml-auto btn  bg-green text-white hover:bg-green"
          onClick={() => setAddShippingPartnerModalOpen(true)}
        >
          + Thêm đối tác
        </button>
      </div>
      <table className="table md:w-[870px] shadow-lg">
        <thead className="bg-green text-white">
          <tr>
            <th>#</th>
            <th>Tên đối tác</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <CircularProgress color="success" />
              </td>
            </tr>
          ) : (
            partners.map((partner, index) => (
              <tr key={partner._id}>
                <td>{(page - 1) * 5 + index + 1}</td>
                <td>{partner.name}</td>
                <td>{partner.description}</td>
                <td>
                  <div>
                    <button
                      onClick={() => handleEditClick(partner)}
                      className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setShippingPartnerToDelete(partner);
                        setShowConfirmModal(true);
                      }}
                      className=" btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="success"
        />
      </div>
      <ConfirmDeleteModal
        showModal={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleDelete}
        title="Xóa đối tác"
        message="Bạn có chắc chắn muốn xóa đối tác này không?"
      />
      <EditShippingPartnerModal
        open={editShippingPartnerModalOpen}
        onClose={() => setEditShippingPartnerModalOpen(false)}
        partner={shippingPartnerToEdit}
        onEditShippingPartner={handleEditShippingPartner}
      />
      <AddShippingPartnerModal
        open={addShippingPartnerModalOpen}
        onClose={() => setAddShippingPartnerModalOpen(false)}
        onAddShippingPartner={handleAddShippingPartner}
      />
    </div>
  );
};

export default ManagementShippingPartners;
