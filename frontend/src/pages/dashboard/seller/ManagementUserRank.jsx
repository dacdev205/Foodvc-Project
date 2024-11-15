import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CircularProgress, Pagination } from "@mui/material";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bounce, toast } from "react-toastify";
import useUserCurrent from "../../../hooks/useUserCurrent";

const EditUserRankModal = React.lazy(() =>
  import("../../../components/Modal/EditUserRankModal")
);

const AddUserRankModal = React.lazy(() =>
  import("../../../components/Modal/AddUserRankModal")
);

const ManagementUserRank = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addUserRankModalOpen, setAddUserRankModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userRankToDelete, setUserRankToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [userRanks, setUserRanks] = useState([]);
  const userData = useUserCurrent();
  const [editUserRankModalOpen, setEditUserRankModalOpen] = useState(false);
  const [userRankToEdit, setUserRankToEdit] = useState(null);

  const {
    data: ranks = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-ranks", page, search],
    queryFn: async () => {
      const res = await axiosSecure.get("/user-ranks", {
        params: { page, limit: 5, search },
      });
      setTotalPages(res.data.pagination.totalPages);
      return res.data.data;
    },
  });

  const handleEditClick = (userRank) => {
    setUserRankToEdit(userRank);
    setEditUserRankModalOpen(true);
  };

  const handleEditUserRank = async (updatedUserRank) => {
    try {
      await axiosSecure.put(
        `/user-ranks/${updatedUserRank._id}`,
        updatedUserRank
      );
      toast.success("Cập nhật hạng người dùng thành công!", {
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
      setEditUserRankModalOpen(false);
      setUserRankToEdit(null);
      refetch();
    } catch (error) {
      toast.error("Cập nhật hạng người dùng thất bại!", {
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

  const handleAddUserRank = async (userRankData) => {
    try {
      await axiosSecure.post("/user-ranks", userRankData);
      toast.success("Thêm hạng người dùng thành công!", {
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
      setAddUserRankModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm hạng người dùng thất bại!", {
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
    if (userRankToDelete) {
      try {
        await axiosSecure.delete(`/user-ranks/${userRankToDelete._id}`);
        toast.success("Xóa hạng người dùng thành công!", {
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
        setUserRankToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Xóa hạng người dùng thất bại!", {
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
        Quản lý <span className="text-green">hạng người dùng</span>
      </h2>
      <div className="flex justify-between my-2 items-center">
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            className="input input-sm input-bordered"
            placeholder="Tìm theo tên / mô tả"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className="btn bg-green text-white hover:bg-green hover:opacity-90"
            onClick={() => setAddUserRankModalOpen(true)}
          >
            + Thêm hạng người dùng
          </button>
        </div>
      </div>
      <table className="table md:w-[870px] shadow-lg">
        <thead className="bg-green text-white">
          <tr>
            <th>#</th>
            <th>Tên hạng</th>
            <th>Điểm hạng</th>
            <th>Giảm giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                <CircularProgress color="success" />
              </td>
            </tr>
          ) : (
            ranks.map((userRank, index) => (
              <tr key={userRank._id}>
                <td>{(page - 1) * 5 + index + 1}</td>
                <td>{userRank.user_rank_name}</td>
                <td>{userRank.user_rank_point}</td>
                <td>{userRank.user_discount}%</td>
                <td>
                  <div>
                    <button
                      onClick={() => handleEditClick(userRank)}
                      className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setUserRankToDelete(userRank);
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
        title="Xóa hạng người dùng"
        message="Bạn có chắc chắn muốn xóa hạng người dùng này không?"
      />
      <EditUserRankModal
        open={editUserRankModalOpen}
        onClose={() => setEditUserRankModalOpen(false)}
        userRank={userRankToEdit}
        onEditUserRank={handleEditUserRank}
      />
      <AddUserRankModal
        open={addUserRankModalOpen}
        onClose={() => setAddUserRankModalOpen(false)}
        onAddUserRank={handleAddUserRank}
      />
    </div>
  );
};

export default ManagementUserRank;
