import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AddUserModal from "./AddUserModal";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import { Bounce, toast } from "react-toastify";
import { Pagination } from "@mui/material";
import userAPI from "../../../api/userAPI";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const axiosSecure = useAxiosSecure();
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const token = localStorage.getItem("access-token");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users", page, searchTerm, filterType],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/search`, {
        params: { page, limit: 5, searchTerm, filterType },
      });
      setTotalPages(res.data.totalPages);
      return res.data.users;
    },
    keepPreviousData: true,
  });
  useEffect(() => {
    refetch();
  }, [page, refetch]);
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/roles/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const handlePageChange = (event, value) => {
    setPage(value);
    refetch();
  };

  const handleRoleChange = async (user, roleId) => {
    try {
      const response = await axiosSecure.patch(`/users/${user._id}/role`, {
        roleId,
      });

      if (response.status === 200) {
        const role = await userAPI.getRoleById(roleId);
        toast.info(`${user.name} bây giờ là ${role.name}`, {
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
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    refetch();
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
    setPage(1);
    refetch();
  };

  const handleAddUser = async (userData) => {
    try {
      await axiosSecure.post("/users/admin/create-user", userData);
      toast.success("Thêm người dùng thành công!", {
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
      refetch();
    } catch (error) {
      toast.error("Thêm người dùng thất bại!", {
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
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  const handleDelete = async (user) => {
    try {
      await axiosSecure.delete(`/users/${user._id}`);
      setShowConfirmModal(false);
      setUserToDelete(null);
      refetch();
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      handleDelete(userToDelete);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">người dùng</span>
      </h2>
      <h5 className="text-black">Tổng số người dùng: {users.length}</h5>
      <div className="flex items-center my-2 justify-between">
        <div className="flex">
          <select
            id="filterType"
            value={filterType}
            onChange={handleFilterTypeChange}
            className="select select-sm"
          >
            <option value="name">Tên người dùng</option>
            <option value="roles">Chức vụ</option>
          </select>
          <div className="flex items-center justify-center">
            <p className="ml-3 text-black">
              <FaSearch />
            </p>
            <input
              type="text"
              placeholder={`Tìm kiếm theo ${
                filterType === "name" ? "tên" : "chức vụ"
              }`}
              value={searchTerm}
              onChange={handleSearch}
              className="input input-sm ml-1"
            />
          </div>
        </div>
        <div>
          <button
            className="btn bg-green text-white border-none hover:opacity-80 hover:bg-green"
            onClick={() => setAddUserModalOpen(true)}
          >
            + Thêm người dùng
          </button>
          <AddUserModal
            addUserModalOpen={addUserModalOpen}
            setAddUserModalOpen={setAddUserModalOpen}
            refetchData={refetch}
            onAddUser={handleAddUser}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table md:w-[870px]">
          <thead className="bg-green text-white rounded-lg">
            <tr className="border-style">
              <th>#</th>
              <th>Tên người dùng</th>
              <th>Email</th>
              <th>Chức vụ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {users.map((user, index) => (
              <tr key={user._id} className="border-gray-300">
                <th>{index + 1}</th>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.roles[0].name === "admin" ? (
                    "Admin"
                  ) : (
                    <select
                      value={user.roles[0]._id}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                    >
                      {roles
                        .filter((role) => role.name.toLowerCase() !== "admin")
                        .map((role) => (
                          <option key={role._id} value={role._id}>
                            {role.name}
                          </option>
                        ))}
                    </select>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="success"
        />
      </div>
      <ConfirmDeleteModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteUser}
        message="Bạn có chắc chắn muốn xóa người dùng này?"
      />
    </div>
  );
};

export default Users;
