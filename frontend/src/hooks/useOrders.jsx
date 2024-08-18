import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import axios from "axios";
import useUserCurrent from "./useUserCurrent";

const useOrders = (
  searchTerm = "",
  filterType = "orderCode",
  page = 1,
  limit = 5
) => {
  const userData = useUserCurrent();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const id = userData?._id || "";
  const axiosPublic = useAxiosPublic();

  const {
    refetch,
    data: orders = { orders: [] },
    isLoading,
  } = useQuery({
    queryKey: ["orders", id, searchTerm, filterType, page, limit],
    queryFn: async () => {
      if (!id) {
        return { orders: [] };
      }
      try {
        const res = await axiosPublic.get(`/order/order-user/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          params: { searchTerm, filterType, page, limit },
        });

        return res.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        return { orders: [] };
      }
    },
  });

  return [orders.orders, orders.totalPages, refetch, isLoading, page];
};

export default useOrders;
