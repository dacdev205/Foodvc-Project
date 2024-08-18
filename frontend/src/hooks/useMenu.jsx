import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useMenu = (
  searchTerm = "",
  filterType = "name",
  category = "all",
  page = 1,
  limit = 5,
  priceRange = [0, 1000000],
  ratingRange = [0, 5]
) => {
  const axiosPublic = useAxiosPublic();

  const effectiveRatingRange =
    Array.isArray(ratingRange) && ratingRange.length === 2
      ? ratingRange
      : [0, 5];
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();

  const {
    refetch,
    data: menus = { menus: [], totalPages: 0 },
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "menus",
      searchTerm,
      filterType,
      category,
      page,
      limit,
      priceRange,
      effectiveRatingRange,
    ],

    queryFn: async () => {
      const res = await axiosPublic.get("/api/foodvc", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          filterType,
          category,
          page,
          limit,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating: effectiveRatingRange[0],
          maxRating: effectiveRatingRange[1],
        },
      });
      return res.data;
    },
  });

  return [menus.menus, menus.totalPages, refetch, isLoading, error];
};

export default useMenu;
