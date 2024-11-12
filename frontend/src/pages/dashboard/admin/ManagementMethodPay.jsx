import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRegPlayCircle, FaSearch, FaTrashAlt, FaEdit } from "react-icons/fa";
import { CircularProgress, Pagination } from "@mui/material";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Bounce, toast } from "react-toastify";
import EditMethodPayModal from "../../../components/Modal/EditMethodPayModal";
import AddMethodPayModal from "../../../components/Modal/AddMethodPayModal";

const ManagementMethodPay = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [methodToEdit, setMethodToEdit] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [methodAddModal, setModalAddMethodOpen] = useState(null);
  const {
    data: methods = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["methods", page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get("/method-deli/all_methods/admin", {
        params: { page, limit: 5, searchTerm },
      });
      setTotalPages(res.data.totalPages);
      return res.data.methods;
    },
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSaveMethodPay = async (methodData) => {
    try {
      await axiosSecure.put(`/method-deli/${methodData._id}`, methodData);

      toast.success("Cập nhật phương thức thanh toán thành công!", {
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
      setModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Lưu phương thức thanh toán thất bại!", {
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
  const handleAddMethodPay = async (methodData) => {
    try {
      await axiosSecure.post("/method-deli/create_method", methodData);
      toast.success("Thêm phương thức thanh toán thành công!", {
        transition: Bounce,
      });
      setModalAddMethodOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm phương thức thanh toán thất bại!", {
        transition: Bounce,
      });
    }
  };
  const handleDeleteMethod = async (methodId) => {
    try {
      await axiosSecure.delete(`/method-deli/${methodId}`);
      toast.success("Xóa phương thức thanh toán thành công!", {
        transition: Bounce,
      });
      refetch();
    } catch (error) {
      toast.error("Xóa phương thức thanh toán thất bại!", {
        transition: Bounce,
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">phương thức thanh toán</span>
      </h2>
      <div className="flex items-center my-2">
        <FaSearch className="ml-3 text-black" />

        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          value={searchTerm}
          onChange={handleSearch}
          className="input input-sm"
        />
        <button
          className="ml-auto btn  bg-green text-white hover:bg-green"
          onClick={() => setModalAddMethodOpen(true)}
        >
          + Thêm phương thức
        </button>
      </div>

      <div>
        <table className="table md:w-[870px] shadow-lg">
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>Tên phương thức</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : methods.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Không có phương thức nào
                </td>
              </tr>
            ) : (
              methods.map((method, index) => (
                <tr key={method._id}>
                  <th>{index + 1 + (page - 1) * 5}</th>
                  <td>{method.name}</td>
                  <td>
                    {method.isActive ? "Đang hoạt động" : "Dừng hoạt động"}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        setMethodToEdit(method) || setModalOpen(true)
                      }
                      className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteMethod(method._id)}
                      className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="success"
        />
      </div>
      <AddMethodPayModal
        open={methodAddModal}
        onClose={() => setModalAddMethodOpen(false)}
        onAddMethodPay={handleAddMethodPay}
      />
      <EditMethodPayModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        method={methodToEdit}
        onSaveMethodPay={handleSaveMethodPay}
      />
    </div>
  );
};

export default ManagementMethodPay;
