import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaRegPlayCircle, FaSearch, FaTrash } from "react-icons/fa";
import { CircularProgress, Pagination } from "@mui/material";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaRegCircleStop } from "react-icons/fa6";
import { Bounce, toast } from "react-toastify";
import { Link } from "react-router-dom";

const ManagementShop = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    data: shops = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["shops", page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get("/shop", {
        params: { page, limit: 5, searchTerm },
      });
      setTotalPages(res.data.totalPages);
      return res.data.shops;
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
  const handleUpdateStatusShop = async (shop) => {
    const updatedStatus = !shop.shop_isActive;
    try {
      await axiosSecure.patch(`/shop/update-status/${shop._id}`, {
        shop_isActive: updatedStatus,
      });
      toast.info("Shop đã được dừng hoạt động!", {
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
      toast.error("Dừng hoạt động shop thất bại!", {
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
        Quản lý tất cả <span className="text-green">cửa hàng</span>
      </h2>
      <div className="flex items-center my-2 justify-between">
        <div className="flex items-center">
          <p className="ml-3 text-black">
            <FaSearch />
          </p>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên cửa hàng"
            value={searchTerm}
            onChange={handleSearch}
            className="input input-sm ml-1"
          />
        </div>
      </div>

      <div>
        <table className="table md:w-[870px] shadow-lg ">
          <thead className="bg-green text-white rounded-lg ">
            <tr className="border-style">
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên cửa hàng</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Hoạt động</th>
              <th>Chính sách hoa hồng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {isLoading ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  <CircularProgress color="success" />
                </td>
              </tr>
            ) : shops.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  Không có cửa hàng nào
                </td>
              </tr>
            ) : (
              shops.map((shop, index) => (
                <tr key={shop._id} className="border-gray-300">
                  <th>{index + 1 + (page - 1) * 5}</th>
                  <td>
                    <div className="avatar hover:scale-105 transition-all duration-200">
                      <div className="mask mask-squircle w-12 h-12">
                        <Link to={`/shop-detail/${shop._id}`}>
                          <img
                            src={`http://localhost:3000/` + shop.shop_image}
                            alt=""
                          />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>{shop.shopName}</td>
                  <td>{shop.description}</td>
                  <td>{shop.shop_isOpen ? "Đang mở" : "Đóng cửa"}</td>
                  <td>
                    {shop.shop_isActive ? "Đang hoạt động" : "Dừng hoạt động"}
                  </td>
                  <td className="text-center">{shop.commissionPolicy?.name}</td>

                  <td>
                    {shop.shop_isActive ? (
                      <button
                        onClick={() => handleUpdateStatusShop(shop)}
                        className="btn btn-xs bg-white hover:bg-slate-300 text-red border-style"
                      >
                        <FaRegCircleStop />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatusShop(shop)}
                        className="btn btn-xs bg-white hover:bg-slate-300 text-green border-style"
                      >
                        <FaRegPlayCircle />
                      </button>
                    )}
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
    </div>
  );
};

export default ManagementShop;
