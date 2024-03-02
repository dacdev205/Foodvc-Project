import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

const useCart = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const email = user?.email || "";
  const queryClient = useQueryClient(); // Initialize the queryClient

  const refetchCart = async () => {
    if (!email) {
      return;
    }
    // Manually fetch wish list data
    await queryClient.invalidateQueries(["cart", email]);
  };

  const { data: cart = [], isLoading } = useQuery({
    queryKey: ["cart", email],
    queryFn: async () => {
      if (!email) {
        return [];
      }
      const res = await fetch(
        `https://foodvc-server.onrender.com/cart?email=${email}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        return [];
      }
      return res.json();
    },
  });

  return [cart, refetchCart, isLoading];
};

export default useCart;
