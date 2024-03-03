import React, { useState, useEffect } from "react";
import useMenu from "../../../hooks/useMenu";
import Pagination from "../../../components/Pagination";
import axios from "axios";
import inventoryAPI from "../../../api/inventoryAPI";
import FormattedPrice from "../../../components/FormatedPriece";
const AddVoucher = () => {
  const [menu, , refetch] = useMenu();
  const PF = "https://foodvc-server.onrender.com";
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const categories = [...new Set(menu.map((item) => item.category))];
  const [selectedProducts, setSelectedProducts] = useState([]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  useEffect(() => {
    refetch();
  }, [sortType, sortOrder, refetch]);

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
  const filteredMenu = menu.filter((item) => {
    const nameMatches = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatches =
      selectedCategory === "" || item.category === selectedCategory;
    return nameMatches && categoryMatches;
  });

  const sortedMenu = filteredMenu.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortOrder === "desc" ? dateA - dateB : dateB - dateA;
  });
  const currentMenu = sortedMenu.slice(indexOfFirstItem, indexOfLastItem);

  const handleApplyVoucher = async () => {
    try {
      // Validate inputs
      if (selectedProducts.length === 0 || !discountPercentage) {
        alert("Vui lòng chọn ít nhất một sản phẩm và nhập thông tin voucher.");
        return;
      }
      // Send a request to the server to apply voucher for selected products
      const response = await axios.post("/api/foodvc/apply-voucher", {
        productId: selectedProducts,
        discount: parseFloat(discountPercentage),
      }); // Update the API path accordingly
      await inventoryAPI.updateProduct(selectedProducts, {
        applyVoucher: true,
      });
      if (response.data.success) {
        alert("Voucher added succesfully");
      } else {
        console.error("Error applying voucher:", response.data.error);
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
    }
    refetch();
  };

  const handleCheckboxChange = (e, productId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedProducts((prevSelectedProducts) => [
        ...prevSelectedProducts,
        productId,
      ]);
    } else {
      setSelectedProducts((prevSelectedProducts) =>
        prevSelectedProducts.filter((id) => id !== productId)
      );
    }
  };
  const mapCategoryToDisplayName = (category) => {
    switch (category) {
      case "protein":
        return "Thịt, cá, trứng, hải sản";
      case "vegetable":
        return "Rau củ, nấm, trái cây";
      case "soup":
        return "Mì, miến, cháo, phở";
      case "milk":
        return "Sữa các loại";
      case "drinks":
        return "Bia, nước giải khát";
      default:
        return category;
    }
  };

  return (
    <div className="w-full md:w-[870px] px-4 mx-auto">
      <h2 className="text-2xl font-semibold my-4 text-black">
        Thêm giảm giá cho <span className="text-green">sản phẩm</span>
      </h2>
      <div>
        <div className="flex items-center">
          <label className="text-black">Loại Hàng/Mặt Hàng:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Chọn loại --</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {mapCategoryToDisplayName(category)}
              </option>
            ))}
          </select>
          <div className="flex items-center my-2 ml-5">
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
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <label className="text-black">Phần Trăm Giảm Giá:</label>
            <input
              type="number"
              className="border p-2 rounded-md text-black"
              placeholder="VD: 5(%)"
              value={discountPercentage}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0 && inputValue <= 100) {
                  setDiscountPercentage(inputValue);
                }
              }}
            />
          </div>
          <button
            className="btn btn-ghost bg-green text-white ml-10 hover:bg-green hover:opacity-80"
            onClick={handleApplyVoucher}
          >
            Áp Dụng Voucher
          </button>
        </div>
      </div>

      <div>
        <div className="overflow-x-auto">
          <table className="table ">
            <thead>
              <tr className="text-black">
                <th>#</th>
                <th>Stt</th>
                <th>Hình ảnh</th>
                <th onClick={() => handleSort("name")} className="curser">
                  Tên sản phẩm
                </th>
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
                <tr key={index} className="text-black">
                  <td>
                    <input
                      type="checkbox"
                      value={item._id}
                      onChange={(e) => handleCheckboxChange(e, item._id)}
                    />
                  </td>
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

export default AddVoucher;
