import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";
import useAxiosPublic from "./useAxiosPublic";
import { responsiveProperty } from "@mui/material/styles/cssUtils";

const useCart = () => {
  const userData = useUserCurrent();
  const id = userData?._id || "";
  const queryClient = useQueryClient();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const axiosPublic = useAxiosPublic();

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
        const res = await axiosPublic.get(`/cart/user/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

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
