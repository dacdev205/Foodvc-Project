import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";
import useAxiosSecure from "./useAxiosSecure";

const useCart = () => {
  const userData = useUserCurrent();
  const id = userData?._id || "";
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const refetchCart = async () => {
    if (!id) {
      return;
    }
    await queryClient.invalidateQueries(["cart", id]);
  };

  const { data: cart = [], isLoading } = useQuery({
    queryKey: ["cart", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }

      try {
        const res = await axiosSecure.get(`/cart/user/${id}`);

        return res.data;
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("Error fetching cart data:", error);
        }
        return [];
      }
    },
  });

  return [cart, refetchCart, isLoading];
};

export default useCart;
