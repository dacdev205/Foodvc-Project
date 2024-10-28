import React, { useState, useEffect } from "react";
import axios from "axios";
import inventoryAPI from "../../../api/inventoryAPI";
import FormattedPrice from "../../../ultis/FormatedPriece";
import { FaCheck } from "react-icons/fa6";
import { Bounce, toast } from "react-toastify";
import useMenuAdmin from "../../../hooks/useMenuAdmin";
import useUserCurrent from "../../../hooks/useUserCurrent";
const AddVoucher = () => {
  const userData = useUserCurrent();
  const shopId = userData?.shops[0];

  const PF = "http://localhost:3000";
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [menu, totalPages, refetch, isLoading, error] = useMenuAdmin(
    searchTerm,
    filterType,
    category,
    page,
    5,
    shopId
  );
  const categories = [...new Set(menu.map((item) => item.productId.category))];

  useEffect(() => {
    refetch();
  }, [sortType, sortOrder, refetch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyVoucher = async () => {
    try {
      // Validate inputs
      if (selectedProducts.length === 0 || !discountPercentage) {
        alert("Vui lòng chọn ít nhất một sản phẩm và nhập thông tin voucher.");
        return;
      }

      const response = await axios.post(PF + "/api/foodvc/apply-voucher", {
        productId: selectedProducts,
        discount: parseFloat(discountPercentage),
      });
      await inventoryAPI.updateProduct(selectedProducts, {
        applyVoucher: true,
      });
      if (response.data.success) {
        toast.success("Thêm voucher thành công!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error("Thêm voucher thất bại!", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
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
          <label className="text-black">Loại Hàng/Mặt Hàng: </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="select-sm select"
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
              className="border p-2 rounded-md text-black input-sm"
            />
          </div>
        </div>
        <div className="flex items-center">
          <div>
            <label className="text-black">Phần Trăm Giảm Giá:</label>
            <input
              type="number"
              className="border p-2 rounded-md text-black input-sm"
              placeholder="VD: 5"
              value={discountPercentage}
              onChange={(e) => {
                const inputValue = e.target.value;
                if (inputValue >= 0 && inputValue <= 100) {
                  setDiscountPercentage(inputValue);
                }
              }}
            />
            <span className="ml-1 text-black">%</span>
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
              <tr className="text-black border-style">
                <th>#</th>
                <th>Stt</th>
                <th>Hình ảnh</th>
                <th className="curser">Tên sản phẩm</th>
                <th>Giá</th>
                <th className="text-center">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item, index) => (
                <tr key={index} className="text-black border-gray-300">
                  <td>
                    <label
                      htmlFor={`checkbox-${item.productId._id}`}
                      className="cursor-pointer relative"
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${item.productId._id}`}
                        checked={selectedProducts.includes(item.productId._id)}
                        onChange={(e) =>
                          handleCheckboxChange(e, item.productId._id)
                        }
                        className="appearance-none w-4 h-4 rounded-sm bg-white border-2 border-[#39d84A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      />
                      <FaCheck
                        className={`absolute top-0 left-[1px] text-green ${
                          selectedProducts.includes(item.productId._id)
                            ? "text-opacity-100"
                            : "text-opacity-0"
                        } check-${item.productId._id} transition`}
                      />
                    </label>
                  </td>
                  <th>{index + 1}</th>

                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={PF + "/" + item.productId.image} alt="" />
                      </div>
                    </div>
                  </td>
                  <td>{item.productId.name.slice(0, 20)}...</td>
                  <td>
                    <FormattedPrice price={item.productId.price} />
                  </td>
                  <td className="text-center">{item.productId.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddVoucher;
