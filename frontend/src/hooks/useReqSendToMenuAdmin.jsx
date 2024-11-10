import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useRequestSendToMenu = (
  searchTerm = "",
  status = "all",
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
    queryKey: ["transfer-requests-admin", searchTerm, status, page, limit],
    queryFn: async () => {
      const res = await axiosPublic.get(`/transfer-req`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: {
          searchTerm,
          status,
          page,
          limit,
        },
      });
      return res.data;
    },
  });

  const { requests, totalPages } = response;

  return { requests, totalPages, refetch, isLoading, error };
};

export default useRequestSendToMenu;
