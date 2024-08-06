import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useInventory = () => {
  const axiosPublic = useAxiosPublic();
  const token = localStorage.getItem("access-token");
  const {
    data: inventory = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const res = await axiosPublic.get("/inventory", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return [inventory, loading, refetch];
};

export default useInventory;
