/* eslint-disable react/prop-types */
import React, { useState } from "react";

const CreateCategoryModal = ({ showModal, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    const newCategory = { name: name.toUpperCase(), description };
    onSave(newCategory);
    setName("");
    setDescription("");
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-md w-80">
          <h2 className="text-xl font-semibold mb-4">Tạo danh mục mới</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-sm input input-bordered w-full mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả danh mục
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full mt-1"
              rows="3"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="btn btn-sm bg-gray-300 hover:bg-gray-400"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="btn btn-sm bg-green text-white hover:bg-green"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateCategoryModal;
