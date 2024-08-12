import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useInventory = (
  searchTerm = "",
  filterType = "name",
  page = 1,
  limit = 5,
  sortBy = "",
  sortOrder = "asc"
) => {
  const axiosPublic = useAxiosPublic();
  const token = localStorage.getItem("access-token");

  const { refetch, data: inventory = { inventory: [] } } = useQuery({
    queryKey: ["inventory", searchTerm, filterType, page, limit],
    queryFn: async () => {
      const res = await axiosPublic.get("/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          filterType,
          page,
          limit,
          sortBy,
          sortOrder,
        },
      });
      return res.data;
    },
  });
  return [inventory.inventory, inventory.totalPages, refetch];
};

export default useInventory;
