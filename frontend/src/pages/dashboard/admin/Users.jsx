import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Pagination from "../../../ultis/Pagination";
import AddUserModal from "./AddUserModal";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import { Bounce, toast } from "react-toastify";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Số lượng mục trên mỗi trang
  const axiosSecure = useAxiosSecure();
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const token = localStorage.getItem("access-token");

  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/roles/getAll", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (filterType === "name") {
      return user.name && user.name.toLowerCase().includes(lowerSearchTerm);
    } else if (filterType === "role") {
      return (
        user.roles[0].name &&
        user.roles[0].name.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return true;
  });

  // Logic phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleRoleChange = async (user, roleId) => {
    try {
      const response = await axiosSecure.patch(`/users/${user._id}/role`, {
        roleId,
      });
      if (response.status === 200) {
        alert(`${user.name} bây giờ là ${roleId}`);
        refetch();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
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
    axiosSecure.delete(`/users/${user._id}`).then((res) => {
      setShowConfirmModal(false);
      setUserToDelete(null);
      refetch();
    });
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const refetchData = () => {
    refetch();
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
            onChange={(e) => setFilterType(e.target.value)}
            className="select select-sm"
          >
            <option value="name">Tên người dùng</option>
            <option value="role">Chức vụ</option>
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
            refetchData={refetchData}
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
            {currentUsers.map((user, index) => (
              <tr key={index} className="border-gray-300">
                <th>{index + 1 + indexOfFirstItem}</th>
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
        <ConfirmDeleteModal
          showModal={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={confirmDeleteUser}
          title="Xác nhận xóa người dùng"
          message="Bạn có chắc chắn muốn xóa người dùng này?"
        />
        {/* Pagination */}
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredUsers.length}
          currentPage={currentPage}
          paginate={paginate}
        />
      </div>
    </div>
  );
};

export default Users;
