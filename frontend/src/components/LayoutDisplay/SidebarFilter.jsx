/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Slider } from "@mui/material";
import categoryAPI from "../../api/categoryAPI";
import { AiOutlineMenu } from "react-icons/ai";

const SidebarFilter = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  category,
  setCategory,
  priceRange = [0, 1000000],
  setPriceRange,
  ratingRange = [0, 5],
  setRatingRange,
}) => {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryAPI.getAllCategory();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handlePriceChange = (event, newValue) => {
    if (newValue && newValue.length === 2) {
      setPriceRange(newValue);
    }
  };

  const handleRatingRangeChange = (event, newValue) => {
    if (newValue && newValue.length === 2) {
      setRatingRange(newValue);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Menu Icon for Mobile */}
      <div className="block lg:hidden p-4">
        <button className="text-2xl text-green-600" onClick={toggleDrawer}>
          <AiOutlineMenu />
        </button>
      </div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 z-30 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 min-h-screen bg-white shadow-lg p-8`}
      >
        <div className="flex justify-between items-center lg:hidden mb-4 mt-16">
          <h2 className="text-2xl font-semibold text-green">Bộ lọc</h2>
          <button className="text-2xl text-gray-500" onClick={toggleDrawer}>
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label htmlFor="search" className="block text-black mb-2">
            Tìm kiếm theo tên:
          </label>
          <input
            type="text"
            id="search"
            placeholder="Nhập tên sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md text-black input-sm w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-black mb-2">Lọc theo giá tiền:</label>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={1000000}
            step={10000}
            className="text-green"
            color="none"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{priceRange[0].toLocaleString()}₫</span>
            <span>{priceRange[1].toLocaleString()}₫</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-black mb-2">Lọc theo đánh giá:</label>
          <Slider
            value={ratingRange}
            onChange={handleRatingRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={5}
            step={0.5}
            className="text-green"
            color="none"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{ratingRange[0]} sao</span>
            <span>{ratingRange[1]} sao</span>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-black mb-2">Lọc theo danh mục:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="block select select-md w-full text-left px-4 py-2 rounded-md bg-gray-100 text-black"
          >
            <option value="all">Tất cả</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name.length > 20
                  ? `${cat.name.slice(0, 20)}...`
                  : cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-20 lg:hidden"
          onClick={toggleDrawer}
        ></div>
      )}
    </div>
  );
};

export default SidebarFilter;
