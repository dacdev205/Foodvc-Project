import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useMenu = () => {
  const axiosPublic = useAxiosPublic();
  const token = localStorage.getItem("access-token");

  const {
    data: menu = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/foodvc", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return [menu, loading, refetch];
};

export default useMenu;
