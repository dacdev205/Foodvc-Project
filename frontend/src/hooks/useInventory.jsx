import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import useUserCurrent from "../hooks/useUserCurrent";

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
  const axiosPublic = useAxiosPublic();
  const token = getToken();

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
      const res = await axiosPublic.get("/inventory", {
        headers: {
          authorization: `Bearer ${token}`,
        },
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
