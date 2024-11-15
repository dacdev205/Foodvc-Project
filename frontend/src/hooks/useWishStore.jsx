import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";
import useAxiosSecure from "./useAxiosSecure";

const useWishStore = () => {
  const userData = useUserCurrent();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const id = userData?._id || "";
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const refetchWishStore = async () => {
    if (!id) {
      return;
    }
    await queryClient.invalidateQueries(["wish-store", id]);
  };

  const { data: wishStore = [], isLoading } = useQuery({
    queryKey: ["wish-store", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      try {
        const res = await axiosSecure.get(`/wish-store/user/${id}`);

        return await res.data;
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching cart data:", error);
        }
        return [];
      }
    },
  });

  return [wishStore, refetchWishStore, isLoading];
};

export default useWishStore;
