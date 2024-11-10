/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";

const EditRoleModal = ({ open, onClose, role, onEditRole, allPermissions }) => {
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions.map((perm) => perm._id));
    }
  }, [role]);

  const handlePermissionToggle = (permId) => {
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(permId)
        ? prevPermissions.filter((id) => id !== permId)
        : [...prevPermissions, permId]
    );
  };

  const handleSubmit = () => {
    onEditRole({
      ...role,
      name,
      permissions: selectedPermissions,
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        open ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">Chỉnh sửa vai trò</h2>
        <input
          type="text"
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Tên vai trò"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mb-4">
          <h3 className="font-semibold">Quyền hạn</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {allPermissions.map((perm) => (
              <label key={perm._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm._id)}
                  onChange={() => handlePermissionToggle(perm._id)}
                />
                <span>{perm.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-green text-white rounded hover:bg-green-600"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

export default EditRoleModal;
