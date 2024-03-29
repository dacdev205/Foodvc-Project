import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaSearch } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Pagination from "../../../ultis/Pagination";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name"); // Default filter type is 'name'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items to show per page
  const axiosSecure = useAxiosSecure();
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
      // Gửi yêu cầu API để cập nhật quyền của người dùng
      const response = await axiosSecure.patch(
        `/users/users/${user._id}/role`,
        {
          role,
        }
      );
      if (response.status === 200) {
        // Nếu cập nhật thành công, hiển thị thông báo và refetch dữ liệu
        alert(`${user.name} is now ${role}`);
        refetch();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật quyền:", error);
    }
  };
  const handleDelete = (user) => {
    axiosSecure.delete(`/users/${user._id}`).then((res) => {
      alert(`${user.name} is removed from the database`);
      refetch();
    });
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold my-4 text-black">
          Quản lý tất cả <span className="text-green">người dùng</span>
        </h2>
        <h5 className="text-black">Tổng số người dùng: {users.length}</h5>
      </div>

      <div className="flex items-center my-2">
        <select
          id="filterType"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded-md"
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
            placeholder={`Search by ${filterType === "name" ? "name" : "role"}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md ml-1 "
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
              <th>Xóa</th>
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
