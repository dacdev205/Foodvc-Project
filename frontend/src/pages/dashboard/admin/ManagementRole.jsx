import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CircularProgress, Pagination, Tooltip } from "@mui/material";
const ConfirmDeleteModal = React.lazy(() =>
  import("../../../ultis/ConfirmDeleteModal")
);
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bounce, toast } from "react-toastify";
const AddRoleModal = React.lazy(() =>
  import("../../../components/Modal/AddRoleModal")
);

const EditRoleModal = React.lazy(() =>
  import("../../../components/Modal/EditRoleModal")
);

const ManagementRole = () => {
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const {
    data: roles = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["roles", page, search],
    queryFn: async () => {
      const res = await axiosSecure.get("/roles", {
        params: { page, limit: 5, search },
      });
      setTotalPages(res.data.totalPages);
      return res.data.roles;
    },
  });
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await axiosSecure.get("/permissions");
        setAllPermissions(res.data.permissions);
        setLoadingPermissions(false);
      } catch (error) {
        console.error("Error fetching permissions", error);
        setLoadingPermissions(false);
      }
    };

    if (open) {
      fetchPermissions();
    }
  }, [axiosSecure]);
  const handleEditClick = (role) => {
    setRoleToEdit(role);
    setEditRoleModalOpen(true);
  };

  const handleAddRole = async (roleData) => {
    try {
      await axiosSecure.post("/roles", roleData);
      toast.success("Thêm vai trò thành công!", {
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
      setAddRoleModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm vai trò thất bại!", {
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
  const handleEditRole = async (updatedRole) => {
    try {
      await axiosSecure.put(`/roles/${updatedRole._id}`, updatedRole);
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
      setEditRoleModalOpen(false);
      setRoleToEdit(null);
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
  const handleDelete = async () => {
    if (roleToDelete) {
      try {
        await axiosSecure.delete(`/roles/${roleToDelete._id}`);
        toast.success("Xóa vai trò thành công!", {
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
        setRoleToDelete(null);
        refetch();
      } catch (error) {
        toast.error("Xóa vai trò thất bại!", {
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
        Quản lý <span className="text-green">vai trò người dùng</span>
      </h2>
      <div className="flex justify-between my-2 items-center">
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            className="input input-sm input-bordered"
            placeholder="Tìm theo tên vai trò"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className="btn bg-green text-white hover:bg-green hover:opacity-90"
            onClick={() => setAddRoleModalOpen(true)}
          >
            + Thêm vai trò
          </button>
          <AddRoleModal
            open={addRoleModalOpen}
            onClose={() => setAddRoleModalOpen(false)}
            onAddRole={handleAddRole}
          />
        </div>
      </div>
      <table className="table md:w-[870px] shadow-lg">
        <thead className="bg-green text-white">
          <tr>
            <th>#</th>
            <th>Tên vai trò</th>
            <th>Quyền hạn</th>
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
            roles.map((role, index) => (
              <tr key={role._id}>
                <td>{(page - 1) * 5 + index + 1}</td>
                <td>{role.name}</td>
                <td>
                  <Tooltip
                    title={role.permissions
                      ?.map((perm) => perm.name)
                      .join(", ")}
                    arrow
                  >
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap block max-w-[200px]">
                      {role.permissions?.map((perm) => perm.name).join(", ")}
                    </span>
                  </Tooltip>
                </td>
                <td>
                  {role.name !== "admin" && (
                    <div>
                      <button
                        onClick={() => handleEditClick(role)}
                        className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setRoleToDelete(role);
                          setShowConfirmModal(true);
                        }}
                        className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
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
        title="Xóa vai trò"
        message="Bạn có chắc chắn muốn xóa vai trò này không?"
      />
      <EditRoleModal
        open={editRoleModalOpen}
        onClose={() => setEditRoleModalOpen(false)}
        role={roleToEdit}
        onEditRole={handleEditRole}
        allPermissions={allPermissions}
      />
    </div>
  );
};

export default ManagementRole;
