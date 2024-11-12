import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useRequestSendToMenu = (
  searchTerm = "",
  status = "all",
  shopId,
  page = 1,
  limit = 5
) => {
  const axiosPublic = useAxiosPublic();

  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();

  const {
    data: response = {
      requests: [],
      totalPages: 0,
    },
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transfer-requests", searchTerm, status, shopId, page, limit],
    queryFn: async () => {
      if (!shopId) {
        return { requests: [], totalPages: 0 };
      }
      const res = await axiosPublic.get(`/transfer-req/${shopId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          status,
          shopId,
          page,
          limit,
        },
      });
      return res.data;
    },
    enabled: !!shopId,
  });

  const { requests, totalPages } = response;

  return { requests, totalPages, refetch, isLoading, error };
};

export default useRequestSendToMenu;
