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

  return (
    <div>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <dialog open={open} className="modal">
            <div className="modal-box bg-white relative">
              <div className="modal-action flex flex-col justify-center mt-0">
                <h3 className="font-bold text-lg text-black">Thêm quyền mới</h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black">Tên quyền:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vd: ho_tro_khach_hang"
                    className="input input-sm input-bordered text-black"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-control">
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

export default AddPermissionModal;
