import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Pagination from "../../../ultis/Pagination";
import AddUserModal from "./AddUserModal";
const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const axiosSecure = useAxiosSecure();
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const auth = useAuth();
  const { refetch, data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (filterType === "name") {
      return user.name && user.name.toLowerCase().includes(lowerSearchTerm);
    } else if (filterType === "role") {
      return user.role && user.role.toLowerCase().includes(lowerSearchTerm);
    }
    return true;
  });
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleRoleChange = async (user, role) => {
    try {
      const response = await axiosSecure.patch(
        `/users/users/${user._id}/role`,
        {
          role,
        }
      );
      if (response.status === 200) {
        alert(`${user.name} bây giờ là ${role}`);
        refetch();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };
  const handleDelete = async (user) => {
    axiosSecure.delete(`/users/${user._id}`).then((res) => {
      alert(`${user.name} da được xóa thành công`);
      refetch();
    });
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
            className="select-sm select"
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
              placeholder={`Search by ${
                filterType === "name" ? "name" : "role"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-1 input input-sm"
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
          />
        </div>
      </div>

      <div className="overflow-x-auto ">
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
                  {user.role === "admin" ? (
                    "Admin"
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                    >
                      <option value="staff">Nhân viên</option>
                      <option value="user">Người dùng</option>
                    </select>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(user)}
                    className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
