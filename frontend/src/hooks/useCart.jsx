import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";

const useCart = () => {
  const userData = useUserCurrent();
  const id = userData?._id || "";
  const queryClient = useQueryClient();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
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
        const res = await fetch(`http://localhost:3000/cart/user/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          return [];
        }

        if (!res.ok) {
          return [];
        }

        return await res.json();
      } catch (error) {
        return [];
      }
    },
  });

  return [cart, refetchCart, isLoading];
};

export default useCart;
