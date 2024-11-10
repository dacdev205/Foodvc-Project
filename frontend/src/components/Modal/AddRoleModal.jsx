/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AddRoleModal = ({ open, onClose, onAddRole }) => {
  const axiosSecure = useAxiosSecure();
  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

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
  }, [axiosSecure, open]);

  const handleAdd = async () => {
    if (name && permissions.length > 0) {
      try {
        const roleData = { name, permissions };
        await axiosSecure("/roles", roleData);
        onAddRole(roleData);
        setName("");
        setPermissions([]);
        onClose();
      } catch (error) {
        alert("Thêm vai trò thất bại!");
      }
    } else {
      alert("Vui lòng điền đầy đủ thông tin và chọn quyền!");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handlePermissionChange = (permissionId) => {
    setPermissions((prevPermissions) =>
      prevPermissions.includes(permissionId)
        ? prevPermissions.filter((id) => id !== permissionId)
        : [...prevPermissions, permissionId]
    );
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <dialog open={open} className="modal">
            <div className="modal-box bg-white relative">
              <div className="modal-action flex flex-col justify-center mt-0">
                <h3 className="font-bold text-lg text-black">
                  Thêm vai trò mới
                </h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black">Tên quyền:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vd: Hỗ trợ tạo blog"
                    className="input input-sm input-bordered text-black"
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black">Quyền hạn:</span>
                  </label>
                  {loadingPermissions ? (
                    <div>Loading permissions...</div>
                  ) : (
                    <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-webkit">
                      {allPermissions?.map((permission) => (
                        <div
                          key={permission?._id}
                          className="flex items-center"
                        >
                          <input
                            type="checkbox"
                            id={`permission-${permission._id}`}
                            value={permission._id}
                            checked={permissions.includes(permission._id)}
                            onChange={() =>
                              handlePermissionChange(permission._id)
                            }
                            className="mr-2"
                          />
                          <label
                            htmlFor={`permission-${permission._id}`}
                            className="text-black"
                          >
                            {permission.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-control mt-6 flex justify-end space-x-2">
                  <button
                    className="btn bg-green text-white hover:bg-green hover:opacity-80 border-none"
                    onClick={handleAdd}
                  >
                    Thêm
                  </button>
                </div>
              </div>
              <button
                className="btn btn-sm bg-transparent border-none hover:bg-transparent absolute right-2 top-2 text-xl text-black"
                onClick={onClose}
              >
                ×
              </button>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default AddRoleModal;
