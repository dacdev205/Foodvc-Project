/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaArrowAltCircleUp,
  FaArrowAltCircleDown,
} from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import inventoryAPI from "../../../api/inventoryAPI";
import menuAPI from "../../../api/menuAPI";
import useInventory from "../../../hooks/useInventory";
import Pagination from "../../../ultis/Pagination";
import FormattedPrice from "../../../ultis/FormatedPriece";

const ManageInventory = () => {
  const PF = "http://localhost:3000";
  const [inventory, , refetch] = useInventory();
  const axiosSecure = useAxiosSecure();

  const [transferQuantity, setTransferQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [newQuantity, setNewQuantity] = useState(1);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    setSortType(value);
    setCurrentPage(1);
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedInventory = filteredInventory.sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortType] > b[sortType] ? 1 : -1;
    } else {
      return a[sortType] < b[sortType] ? 1 : -1;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInventory = sortedInventory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await inventoryAPI.deleteProductById(item._id);
        if (res) {
          refetch();
          Swal.fire({
            title: "Deleted!",
            text: "Your food has been deleted.",
            icon: "success",
          });
        }
      }
    });
  };

  const handleTransferToMenu = async (item) => {
    try {
      const { value: transferQty } = await Swal.fire({
        title: "Enter quantity",
        input: "number",
        inputValue: transferQuantity,
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
      });

      if (transferQty) {
        const parsedQuantity = parseInt(transferQty, 10);
        const response = await axiosSecure.post("/inventory/transfer-to-menu", {
          productId: item._id,
          quantity: parsedQuantity,
        });

        if (response.data.message === "Product transferred successfully") {
          setTransferQuantity(1);
          refetch();
          Swal.fire({
            title: "Transferred!",
            text: "Your food has been transferred to the menu.",
            icon: "success",
          });
        }
      }
    } catch (error) {
      console.error("Error transferring item:", error);
    }
  };

  const handleRemoveFromMenu = async (item) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to remove this item from the menu.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove it!",
      });

      if (result.isConfirmed) {
        const response = await axiosSecure.post("/inventory/remove-from-menu", {
          menuItemId: item._id,
        });

        if (
          response.data.message === "Product removed from menu successfully"
        ) {
          Swal.fire({
            title: "Removed!",
            text: "Your food has been removed from the menu.",
            icon: "success",
          });

          refetch();
        } else {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while removing the product from the menu.",
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleUpdateQuantity = async (item) => {
    try {
      const { value: newQty } = await Swal.fire({
        title: "Enter new quantity",
        input: "number",
        inputValue: newQuantity,
        inputAttributes: {
          min: 1,
          step: 1,
        },
        showCancelButton: true,
      });

      if (newQty) {
        const parsedQuantity = parseInt(newQty, 10);
        await menuAPI.updateQuantityProduct(`${item._id}`, {
          quantity: parsedQuantity,
        });
        setNewQuantity(parsedQuantity);
        refetch();
        Swal.fire({
          title: "Quantity Updated!",
          text: "The quantity has been updated successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="w-full md:w-[900px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Quản lý tất cả <span className="text-green">sản phẩm trong kho</span>
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
          className="border p-2 rounded-md text-black"
        />
        <label htmlFor="sort" className="ml-2 mr-2 text-black">
          Sắp xếp theo:
        </label>
        <select
          id="sort"
          value={sortType}
          onChange={handleSort}
          className="border p-2 rounded-md text-black"
        >
          <option value="name">Tên sản phẩm</option>
          <option value="price">Giá</option>
          <option value="quantity">Số lượng</option>
          <option value="status">Trạng thái</option>
        </select>
        <label htmlFor="order" className="ml-2 mr-2 text-black">
          Thứ tự:
        </label>
        <select
          id="order"
          value={sortOrder}
          onChange={handleOrderChange}
          className="border p-2 rounded-md"
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="table ">
            <thead>
              <tr className="text-black border-style">
                <th>#</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng tồn kho</th>
                <th>Chỉnh sửa</th>
                <th className="text-center">Xóa</th>
                <th className="text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentInventory.map((item, index) => (
                <tr key={index} className="boder border-gray-300">
                  <th className="text-black">{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={PF + "/" + item.image} alt="" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-black">{item.name.slice(0, 20)}...</td>
                  <td>
                    <FormattedPrice price={item.price} />
                  </td>
                  <td className="text-center text-black">{item.quantity}</td>
                  <td className="text-center">
                    <Link to={`/admin/update-item/${item._id}`}>
                      <button className="btn btn-ghost btn-xs bg-orange-500 text-white">
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="btn btn-ghost btn-xs text-red"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                  <td>
                    {item.transferredToMenu ? (
                      <div>
                        <button
                          onClick={() => handleUpdateQuantity(item)}
                          className={`btn btn-ghost btn-xs text-blue-500`}
                        >
                          Update Quantity
                        </button>
                        <button
                          onClick={() => handleRemoveFromMenu(item)}
                          className={`btn btn-ghost btn-xs text-red`}
                        >
                          <FaArrowAltCircleDown />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTransferToMenu(item)}
                        className="btn btn-ghost btn-xs text-green"
                      >
                        <FaArrowAltCircleUp />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={filteredInventory.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageInventory;
