import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";
import { useEffect } from "react";

const useCart = () => {
  const userData = useUserCurrent();
  const token = localStorage.getItem("access-token");
  const id = userData?._id || "";
  const queryClient = useQueryClient();

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
      const res = await fetch(`http://localhost:3000/cart/user/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        return [];
      }
      return res.json();
    },
  });

  return [cart, refetchCart, isLoading];
};

export default useCart;
