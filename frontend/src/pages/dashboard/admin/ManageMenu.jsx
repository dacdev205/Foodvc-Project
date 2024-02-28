import React, { useState, useEffect } from "react";
import useMenu from "../../../hooks/useMenu";
import Pagination from "../../../components/Pagination";
import FormattedPrice from "../../../components/FormatedPriece";

const ManageMenu = () => {
  const [menu, , refetch] = useMenu();
  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    refetch();
  }, [sortType, sortOrder, refetch]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMenu = filteredMenu.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortOrder === "desc" ? dateA - dateB : dateB - dateA;
  });

  const currentMenu = sortedMenu.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (type) => {
    if (type === sortType) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortType(type);
      setSortOrder("asc");
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4">
        Quản lý tất cả <span className="text-green">sản phẩm</span>
      </h2>
      <div className="flex items-center my-2">
        <label htmlFor="search" className="mr-2">
          Tìm kiếm theo tên:
        </label>
        <input
          type="text"
          id="search"
          placeholder="Nhập tên sản phẩm"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded-md"
        />
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>#</th>
                <th>Hình ảnh</th>
                <th onClick={() => handleSort("name")}>Tên sản phẩm</th>
                <th onClick={() => handleSort("price")}>Giá</th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="text-center"
                >
                  Số lượng
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMenu.map((item, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={PF + "/" + item.image} alt="" />
                      </div>
                    </div>
                  </td>
                  <td>{item.name.slice(0, 20)}...</td>
                  <td>
                    <FormattedPrice price={item.price} />
                  </td>

                  <td className="text-center">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredMenu.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageMenu;
