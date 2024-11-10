import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CircularProgress, Pagination } from "@mui/material";
import ConfirmDeleteModal from "../../../components/Modal/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import useUserCurrent from "../../../hooks/useUserCurrent";
import AddPermissionModal from "./AddPermissionModal";

const ManagementPermission = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addPermissionModalOpen, setAddPermissionModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [adminPermissions, setAdminPermissions] = useState([]);
  const userData = useUserCurrent();

  const {
    data: permissions = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["permissions", page, search],
    queryFn: async () => {
      const res = await axiosSecure.get("/permissions", {
        params: { page, limit: 5, search },
      });
      setTotalPages(res.data.totalPages);
      return res.data.permissions;
    },
  });

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const res = await axiosSecure.get(
          `/users/getPermissions/${userData?.email}`
        );
        const roles = res.data.user;

        const adminRole = roles.find((role) => role.name === "admin");
        if (adminRole) {
          setAdminPermissions(adminRole.permissions);
        }
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };
    fetchUserRoles();
  }, [axiosSecure, userData?.email]);

  const isAdminPermission = (permissionId) => {
    return adminPermissions.includes(permissionId);
  };

  const handleAddPermission = async (permissionData) => {
    try {
      await axiosSecure.post("/permissions", permissionData);
      toast.success("Thêm quyền thành công!");
      setAddPermissionModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm quyền thất bại!");
    }
  };

  const handleDelete = async () => {
    if (permissionToDelete) {
      try {
        await axiosSecure.delete(`/permissions/${permissionToDelete._id}`);
        toast.success("Xóa quyền thành công!");
        setShowConfirmModal(false);
        setPermissionToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Xóa quyền thất bại!");
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
        Quản lý quyền <span className="text-green">truy cập</span>
      </h2>
      <div className="flex justify-between my-2 items-center">
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            className="input input-sm input-bordered"
            placeholder="Tìm quyền theo tên / mô tả"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className="btn bg-green text-white hover:bg-green hover:opacity-90"
            onClick={() => setAddPermissionModalOpen(true)}
          >
            + Thêm quyền
          </button>
          <AddPermissionModal
            open={addPermissionModalOpen}
            onClose={() => setAddPermissionModalOpen(false)}
            onAddPermission={handleAddPermission}
          />
        </div>
      </div>
      <table className="table md:w-[870px] shadow-lg">
        <thead className="bg-green text-white">
          <tr>
            <th>#</th>
            <th>Tên quyền</th>
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
            permissions.map((permission, index) => (
              <tr key={permission._id}>
                <td>{(page - 1) * 5 + index + 1}</td>
                <td>{permission.name}</td>
                <td>{permission.description}</td>
                <td>
                  {!isAdminPermission(permission._id) && (
                    <div>
                      <button className="btn btn-xs text-blue">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setPermissionToDelete(permission);
                          setShowConfirmModal(true);
                        }}
                        className="btn btn-xs text-red"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
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
        title="Xóa quyền"
        message="Bạn có chắc chắn muốn xóa quyền này không?"
      />
    </div>
  );
};

export default ManagementPermission;
