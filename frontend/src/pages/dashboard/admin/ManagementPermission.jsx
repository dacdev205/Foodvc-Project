import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CircularProgress, Pagination } from "@mui/material";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bounce, toast } from "react-toastify";
import useUserCurrent from "../../../hooks/useUserCurrent";
const EditPermissionModal = React.lazy(() =>
  import("../../../components/Modal/EditPermissonModal")
);

const AddPermissionModal = React.lazy(() =>
  import("../../../components/Modal/AddPermissionModal")
);

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
  const [editPermissionModalOpen, setEditPermissionModalOpen] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState(null);
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
    if (userData?.email) {
      fetchUserRoles();
    }
  }, [axiosSecure, userData?.email]);

  const isAdminPermission = (permissionId) => {
    return adminPermissions.includes(permissionId);
  };
  const handleEditClick = (permission) => {
    setPermissionToEdit(permission);
    setEditPermissionModalOpen(true);
  };
  const handleEditPermission = async (updatedPermission) => {
    try {
      await axiosSecure.put(
        `/permissions/${updatedPermission._id}`,
        updatedPermission
      );
      toast.success("Cập nhật quyền thành công!", {
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
      setEditPermissionModalOpen(false);
      setPermissionToEdit(null);
      refetch();
    } catch (error) {
      toast.error("Cập nhật quyền thất bại!", {
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
  const handleAddPermission = async (permissionData) => {
    try {
      await axiosSecure.post("/permissions", permissionData);
      toast.success("Thêm quyền thành công!", {
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
      setAddPermissionModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm quyền thất bại!", {
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
    if (permissionToDelete) {
      try {
        await axiosSecure.delete(`/permissions/${permissionToDelete._id}`);
        toast.success("Xóa quyền thành công!", {
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
        setPermissionToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Xóa quyền thất bại!", {
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
        Quản lý <span className="text-green">quyềntruy cập</span>
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
            onClick={() => setAddPermissionModalOpen(true)}
          >
            + Thêm quyền
          </button>
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
                      <button
                        onClick={() => handleEditClick(permission)}
                        className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setPermissionToDelete(permission);
                          setShowConfirmModal(true);
                        }}
                        className=" btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
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
      <EditPermissionModal
        open={editPermissionModalOpen}
        onClose={() => setEditPermissionModalOpen(false)}
        permission={permissionToEdit}
        onEditPermission={handleEditPermission}
      />
      <AddPermissionModal
        open={addPermissionModalOpen}
        onClose={() => setAddPermissionModalOpen(false)}
        onAddPermission={handleAddPermission}
      />
    </div>
  );
};

export default ManagementPermission;
