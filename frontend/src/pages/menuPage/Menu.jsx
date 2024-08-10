import React, { useState, useEffect } from "react";
import Cards from "../../components/CardProduct/Cards";
import { Pagination } from "@mui/material";
import useMenu from "../../hooks/useMenu";
import CircularProgress from "@mui/material/CircularProgress";

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [menu, totalPages, refetch, isLoading, error] = useMenu(
    searchTerm,
    filterType,
    category,
    page,
    8
  );

  useEffect(() => {
    refetch();
  }, [page, searchTerm, filterType, category, refetch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );

  if (error) return <div className="text-center py-4">Failed to load menu</div>;

  return (
    <div>
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
        <div className="py-48 flex flex-col items-center justify-center">
          <div className="text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug text-black">
              Vì tình yêu đồ ăn <span className="text-green">ngon</span>
            </h2>
            <p className="text-[#4A4A4A] text-xl md:w-4/5 mx-auto">
              Hãy đến cùng gia đình và cảm nhận niềm vui khi thưởng thức các món
              ăn ngon miệng như Salad Hy Lạp, Lasagne, Bí ngô Butternut, Tokusen
              Wagyu, Olivas Rellenas và nhiều món khác với chi phí vừa phải
            </p>
            <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full border-style hover:bg-green hover:opacity-80">
              Đặt ngay
            </button>
          </div>
        </div>
      </div>

      <div className="section-container">
        <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8">
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
        </div>

        <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4 flex-wrap text-black mb-8">
          <button
            onClick={() => handleCategoryChange("all")}
            className={category === "all" ? "active" : ""}
          >
            Tất cả
          </button>
          <button
            onClick={() => handleCategoryChange("protein")}
            className={category === "protein" ? "active" : ""}
          >
            Thịt, cá, trứng, hải sản
          </button>
          <button
            onClick={() => handleCategoryChange("vegetable")}
            className={category === "vegetable" ? "active" : ""}
          >
            Rau củ, nấm, trái cây
          </button>
          <button
            onClick={() => handleCategoryChange("soup")}
            className={category === "soup" ? "active" : ""}
          >
            Mì, miến, cháo, phở
          </button>
          <button
            onClick={() => handleCategoryChange("milk")}
            className={category === "milk" ? "active" : ""}
          >
            Sữa các loại
          </button>
          <button
            onClick={() => handleCategoryChange("drinks")}
            className={category === "drinks" ? "active" : ""}
          >
            Bia, nước giải khát
          </button>
        </div>

        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
          {menu.length > 0 ? (
            menu.map((item) => <Cards key={item.productId._id} item={item} />)
          ) : (
            <p className="text-center py-4 text-gray-500">
              Không có sản phẩm nào.
            </p>
          )}
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

export default Menu;
