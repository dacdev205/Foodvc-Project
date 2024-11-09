// Menu Component
import React, { useState, useEffect } from "react";
import Cards from "../../components/CardProduct/Cards";
import { Pagination } from "@mui/material";
import useMenu from "../../hooks/useMenu";
import CircularProgress from "@mui/material/CircularProgress";
import SidebarFilter from "../../components/LayoutDisplay/SidebarFilter";
const Menu = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [ratingRange, setRatingRange] = useState([0, 5]);

  const [menu, totalPages, refetch, isLoading, error] = useMenu(
    searchTerm,
    filterType,
    category,
    page,
    8,
    priceRange,
    ratingRange
  );

  useEffect(() => {
    refetch();
  }, [page, searchTerm, filterType, category, refetch]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
      <div className="flex">
        {/* Sidebar */}
        <div className="">
          <SidebarFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            ratingRange={ratingRange}
            setRatingRange={setRatingRange}
          />
        </div>

        {/* Content */}
        <div className="flex-1 ml-4">
          {isLoading ? (
            <div className="flex flex-1 justify-center items-center min-h-screen">
              <CircularProgress color="success" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
              {menu.length > 0 ? (
                menu.map((item) => (
                  <Cards key={item.productId._id} item={item} />
                ))
              ) : (
                <div className="flex justify-center items-center col-span-full">
                  <p className="text-center py-4 text-gray-500">
                    Không có sản phẩm nào.
                  </p>
                </div>
              )}
            </div>
          )}

          {menu.length > 0 && !isLoading && (
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
      </div>
    </div>
  );
};

export default Menu;
