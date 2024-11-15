import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useInventory = (
  searchTerm = "",
  filterType = "name",
  page = 1,
  limit = 5,
  sortBy = "",
  sortOrder = "asc",
  shopId = ""
) => {
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const axiosSecure = useAxiosSecure();
  const {
    refetch,
    data: inventory = { inventory: [] },
    isLoading,
  } = useQuery({
    queryKey: ["inventory", searchTerm, filterType, page, limit],
    queryFn: async () => {
      if (!shopId) {
        return { inventory: [] };
      }
      const res = await axiosSecure.get("/inventory", {
        params: {
          searchTerm,
          filterType,
          page,
          limit,
          sortBy,
          sortOrder,
          shopId,
        },
      });
      return res.data;
    },
  });
  return [inventory.inventory, inventory.totalPages, refetch, isLoading];
};

export default useInventory;
