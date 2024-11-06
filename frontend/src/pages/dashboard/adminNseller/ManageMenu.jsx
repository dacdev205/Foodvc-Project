import React, { useState, useEffect } from "react";
import FormattedPrice from "../../../ultis/FormatedPriece";
import { CircularProgress, Pagination } from "@mui/material";
import useMenuSeller from "../../../hooks/useMenuSeller";
import useUserCurrent from "../../../hooks/useUserCurrent";

const ManageMenu = () => {
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];

  const [menu, totalPages, refetch, isLoading, error] = useMenuSeller(
    searchTerm,
    filterType,
    category,
    page,
    5,
    shopId
  );

  useEffect(() => {
    refetch();
  }, [page, searchTerm, filterType, category, refetch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">sản phẩm</span>
      </h2>
      <div className="flex items-center my-2">
        <label htmlFor="search" className="mr-2 text-black">
          Tìm kiếm theo tên:
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
      <div>
        <div className="">
          <table className="table shadow-lg">
            <thead className="bg-green text-white">
              <tr className="border-style">
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th className="text-center">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    <CircularProgress color="success" />
                  </td>
                </tr>
              ) : menu.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                menu.map((item, index) => (
                  <tr key={index} className="text-black border-gray-300">
                    <th>{index + 1}</th>
                    <td>
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={PF + "/" + item.productId.image} alt="" />
                        </div>
                      </div>
                    </td>
                    <td
                      className="tooltip mt-4 tooltip-bottom"
                      data-tip={item.productId.name}
                    >
                      {item.productId.name.slice(0, 20)}...
                    </td>
                    <td>
                      <FormattedPrice price={item.productId.price} />
                    </td>
                    <td className="text-center">{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {menu.length > 0 && (
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

export default ManageMenu;
