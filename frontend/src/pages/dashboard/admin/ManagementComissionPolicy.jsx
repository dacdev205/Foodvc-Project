import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaTrashAlt, FaEdit } from "react-icons/fa";
import { CircularProgress, Pagination, Tooltip } from "@mui/material";
import { Bounce, toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AddCommissionTierModal from "../../../components/Modal/AddCommissionTierModal";
import EditCommissionTierModal from "../../../components/Modal/EditCOmmissionTierModal";
import FormattedPrice from "../../../ultis/FormatedPriece";

const ManagementCommissionPolicy = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tierToEdit, setTierToEdit] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  const {
    data: commissionTiers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["commissionTiers", page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get("/commissions", {
        params: { page, limit: 5, searchTerm },
      });
      setTotalPages(res.data.totalPages);
      return res.data.tiers;
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

  const handleAddCommissionTier = async (tierData) => {
    try {
      await axiosSecure.post("/commissions", tierData);
      toast.success("Thêm chính sách hoa hồng thành công!", {
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
      setAddModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Thêm chính sách hoa hồng thất bại!", {
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

  // Function to edit an existing commission tier
  const handleEditCommissionTier = async (tierData) => {
    try {
      await axiosSecure.put(`/commissions/${tierData._id}`, tierData);
      toast.success("Cập nhật chính sách hoa hồng thành công!", {
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
      setEditModalOpen(false);
      refetch();
    } catch (error) {
      toast.error("Cập nhật chính sách hoa hồng thất bại!", {
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

  // Function to delete a commission tier
  const handleDeleteCommissionTier = async (tierId) => {
    try {
      await axiosSecure.delete(`/commissions/${tierId}`);
      toast.success("Xóa chính sách hoa hồng thành công!", {
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
      refetch();
    } catch (error) {
      toast.error("Xóa chính sách hoa hồng thất bại!", {
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

  return (
    <div>
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">chính sách hoa hồng</span>
      </h2>
      <div className="flex items-center my-2">
        <FaSearch className="ml-3 text-black" />
        <input
          type="text"
          placeholder="Tìm kiếm chính sách..."
          value={searchTerm}
          onChange={handleSearch}
          className="input input-sm"
        />
        <button
          className="ml-auto btn bg-green text-white hover:bg-green"
          onClick={() => setAddModalOpen(true)}
        >
          + Thêm chính sách
        </button>
      </div>

      <div>
        <table className="table md:w-[870px] shadow-lg">
          <thead className="bg-green text-white rounded-lg">
            <tr>
              <th>#</th>
              <th>Tên cấp bậc</th>
              <th>Mô tả</th>
              <th>Doanh thu yêu cầu</th>
              <th>Tỷ lệ hoa hồng (%)</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : commissionTiers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Không có chính sách nào
                </td>
              </tr>
            ) : (
              commissionTiers.map((tier, index) => (
                <tr key={tier._id}>
                  <th>{index + 1 + (page - 1) * 5}</th>
                  <td>{tier.name}</td>
                  <td>
                    <Tooltip arrow title={tier.description}>
                      <span>{tier.description.slice(0, 10)}...</span>
                    </Tooltip>
                  </td>
                  <FormattedPrice price={tier.revenueRequired}></FormattedPrice>

                  <td>
                    <FormattedPrice
                      price={tier.revenueRequired}
                    ></FormattedPrice>
                  </td>
                  <td>{tier.commissionRate}%</td>
                  <td>
                    <button
                      onClick={() => {
                        setTierToEdit(tier);
                        setEditModalOpen(true);
                      }}
                      className="btn btn-xs bg-white hover:bg-slate-300 text-blue border-style"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteCommissionTier(tier._id)}
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
      <AddCommissionTierModal
        open={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddTier={handleAddCommissionTier}
      />
      <EditCommissionTierModal
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        tier={tierToEdit}
        onSaveTier={handleEditCommissionTier}
      />
    </div>
  );
};

export default ManagementCommissionPolicy;
