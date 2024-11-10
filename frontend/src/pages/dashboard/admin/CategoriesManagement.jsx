import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress, Pagination } from "@mui/material";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import ConfirmDeleteModal from "../../../ultis/ConfirmDeleteModal";
import CreateCategoryModal from "../../../components/Modal/CreateCategoryModal";
import categoryAPI from "../../../api/categoryAPI";
import { useNavigate } from "react-router-dom";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();
  const fetchCategories = async (page, searchTerm) => {
    setLoading(true);
    try {
      const response = await categoryAPI.getAllCategory(searchTerm, page);
      setCategories(response.categories);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("There was an error fetching categories!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(page, searchTerm);
  }, [page, searchTerm]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      await categoryAPI.deleteCategoryById(id);
      setShowConfirmModal(false);
      setCategoryToDelete(null);
      await fetchCategories(page, searchTerm);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      handleDelete(categoryToDelete);
    }
  };
  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
  };
  const handleCreateCategory = async (newCategory) => {
    try {
      await categoryAPI.createCategory(newCategory);
      setShowCreateModal(false);
      await fetchCategories(page, searchTerm);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">danh mục</span>
      </h2>

      <div className="flex items-center my-2">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="input input-sm"
        />
        <button
          className="ml-auto btn  bg-green text-white hover:bg-green"
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus className="mr-1" />
          Tạo danh mục
        </button>
      </div>

      <table className="table md:w-[870px] shadow-lg">
        <thead className="bg-green text-white rounded-lg">
          <tr className="border-style">
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th className="text-center">Thao tác</th>
          </tr>
        </thead>
        {loading ? (
          <tr>
            <td colSpan="4" className="text-center py-4">
              <CircularProgress color="success" />
            </td>
          </tr>
        ) : categories.length === 0 ? (
          <tr>
            <td colSpan="4" className="text-center py-4">
              Không có danh mục nào
            </td>
          </tr>
        ) : (
          <tbody>
            {categories.map((category, index) => (
              <tr key={category._id} className="border-gray-300 text-black">
                <td>{(page - 1) * 5 + index + 1}</td>
                <td>{category.name}</td>
                <td>{category.description.slice(0, 30)}...</td>
                <td className="py-2 px-4 flex space-x-2 justify-center">
                  <button
                    className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                    onClick={() => handleEditClick(category._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                    onClick={() => handleDeleteClick(category._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>

      <ConfirmDeleteModal
        showModal={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteCategory}
        title="Xác nhận xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này?"
      />

      <CreateCategoryModal
        showModal={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateCategory}
      />

      {/* Pagination */}
      {categories.length > 0 && (
        <div className="flex justify-center mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="success"
          />
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
