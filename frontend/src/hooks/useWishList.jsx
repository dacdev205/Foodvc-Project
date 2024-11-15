import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";
import useAxiosPublic from "./useAxiosPublic";
import useAxiosSecure from "./useAxiosSecure";

const useWishList = () => {
  const userData = useUserCurrent();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const id = userData?._id || "";
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const refetchWishList = async () => {
    if (!id) {
      return { wishList: [], totalPages: 0 };
    }
    await queryClient.invalidateQueries(["wish-list", id]);
  };

  const { data: wishList = [], isLoading } = useQuery({
    queryKey: ["wish-list", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      try {
        const res = await axiosSecure.get(`/wish-list/user/${id}`);

        return await res.data;
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching cart data:", error);
        }
        return [];
      }
    },
  });

  return [wishList, refetchWishList, isLoading];
};

export default useWishList;
