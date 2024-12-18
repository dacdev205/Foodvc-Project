/* eslint-disable react/prop-types */
import React, { useState } from "react";

const AddPermissionModal = ({ open, onClose, onAddPermission }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (name && description) {
      onAddPermission({ name, description });
      setName("");
      setDescription("");
    } else {
      alert("Vui lòng điền đầy đủ thông tin!");
    }
  };

  const handleNameChange = (e) => {
    const inputValue = e.target.value.replace(/ /g, "_");
    setName(inputValue);
  };

  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-box bg-white relative p-6 rounded shadow-lg max-w-md w-full">
            <button
              className="btn btn-sm bg-transparent border-none hover:bg-transparent absolute right-2 top-2 text-xl text-black"
              onClick={onClose}
            >
              ×
            </button>
            <h3 className="font-bold text-lg text-black">Thêm quyền mới</h3>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-black">Tên quyền:</span>
              </label>
              <input
                type="text"
                placeholder="Vd: ho_tro_khach_hang"
                className="input input-sm input-bordered text-black"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text text-black">Mô tả:</span>
              </label>
              <textarea
                placeholder="Mô tả quyền"
                className="input input-sm input-bordered text-black h-24"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control mt-6 flex justify-end space-x-2">
              <button
                className="btn bg-green text-white hover:bg-green-600 border-none"
                onClick={handleAdd}
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPermissionModal;
