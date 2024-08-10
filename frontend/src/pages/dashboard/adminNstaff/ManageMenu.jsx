import React, { useState, useEffect } from "react";
import useMenu from "../../../hooks/useMenu";
import FormattedPrice from "../../../ultis/FormatedPriece";
import { Pagination } from "@mui/material";

const ManageMenu = () => {
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("all");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
    refetch();
  };
  const [menu, totalPages, refetch] = useMenu(
    searchTerm,
    filterType,
    category,
    page,
    5
  );
  useEffect(() => {
    refetch();
  }, [page, searchTerm, filterType, refetch]);
  const handlePageChange = (value) => {
    setPage(value);
    refetch();
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
          <table className="table">
            <thead>
              <tr className="text-black border-style">
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th className="text-center">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
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

export default ManageMenu;
