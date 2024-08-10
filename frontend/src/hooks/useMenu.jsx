import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useMenu = (
  searchTerm = "",
  filterType = "name",
  category,
  page = 1,
  limit = 2
) => {
  const axiosPublic = useAxiosPublic();
  const token = localStorage.getItem("access-token");

  const { refetch, data: menus = { menus: [] } } = useQuery({
    queryKey: ["menus", { searchTerm, filterType, category, page, limit }],
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
        },
      });
      return res.data;
    },
  });

  return [menus.menus, menus.totalPages, refetch];
};

export default useMenu;
