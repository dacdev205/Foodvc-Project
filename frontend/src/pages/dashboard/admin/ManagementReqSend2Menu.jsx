import React, { useState, useEffect } from "react";
import { CircularProgress, Pagination, Button } from "@mui/material";
import FormattedPrice from "../../../ultis/FormatedPriece";
import useUserCurrent from "../../../hooks/useUserCurrent";
import useReqSendToMenuAdmin from "../../../hooks/useReqSendToMenuAdmin";
import axios from "axios";
import { FcApprove, FcDisapprove } from "react-icons/fc";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
const RequestSend2Menu = () => {
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const axiosSecure = useAxiosSecure();

  const { requests, totalPages, refetch, isLoading, error } =
    useReqSendToMenuAdmin(searchTerm, status, page, limit);

  useEffect(() => {
    refetch();
  }, [page, searchTerm, status, refetch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleApprove = async (id) => {
    try {
      await axiosSecure.post(`/inventory/approve-transfer-to-menu/${id}`);
      refetch();
    } catch (error) {
      console.error("Error approving transfer request:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.put(`/inventory/reject-transfer-to-menu/${id}`);
      refetch();
    } catch (error) {
      console.error("Error rejecting transfer request:", error);
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý <span className="text-green">Yêu cầu đưa lên menu</span>
      </h2>

      {/* Search input */}
      <div className="flex items-center my-2">
        <label htmlFor="search" className="mr-2 text-black">
          Tìm kiếm theo tên sản phẩm:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Nhập tên sản phẩm"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded-md text-black input-sm"
        />
      </div>

      {/* Table display */}
      <div>
        <table className="table shadow-lg">
          <thead className="bg-green text-white">
            <tr className="border-style">
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th className="text-center">Số lượng</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Ngày tạo</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : requests?.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Không có yêu cầu nào
                </td>
              </tr>
            ) : (
              requests.map((item, index) => (
                <tr key={index} className="text-black border-gray-300">
                  <th>{index + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={`${PF}/${item?.productId?.image}`}
                          alt={item?.productId?.name}
                        />
                      </div>
                    </div>
                  </td>
                  <td
                    className="tooltip mt-4 tooltip-bottom"
                    data-tip={item?.productId?.name}
                  >
                    {item?.productId?.name?.slice(0, 20)}...
                  </td>
                  <td>
                    <FormattedPrice price={item?.productId?.price} />
                  </td>
                  <td className="text-center">{item?.quantity}</td>
                  <td className="text-center">
                    {item.status === "pending"
                      ? "Đang chờ"
                      : item.status === "approved"
                      ? "Đã được duyệt"
                      : "Đã bị từ chối"}
                  </td>
                  <td className="text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  {item.status === "pending" ? (
                    <td className="text-center">
                      <button
                        onClick={() => handleApprove(item._id)}
                        className="btn btn-xs bg-white hover:bg-slate-300  border-style"
                      >
                        <FcApprove />
                      </button>
                      <button
                        className="btn btn-xs bg-white hover:bg-slate-300  border-style"
                        onClick={() => handleReject(item._id)}
                      >
                        <FcDisapprove />
                      </button>
                    </td>
                  ) : (
                    ""
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {requests.length > 0 && (
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

export default RequestSend2Menu;
