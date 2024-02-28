import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient

const useWishList = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const email = user?.email || "";
  const queryClient = useQueryClient(); // Initialize the queryClient

  // Define refetchWishList function
  const refetchWishList = async () => {
    if (!email) {
      return;
    }
    // Manually fetch wish list data
    await queryClient.invalidateQueries(["wish-list", email]);
  };

  const { data: wishList = [], isLoading } = useQuery({
    queryKey: ["wish-list", email],
    queryFn: async () => {
      if (!email) {
        return [];
      }
      const res = await fetch(
        `http://localhost:3000/wish-list?email=${email}`,
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

  return [wishList, refetchWishList, isLoading];
};

export default useWishList;
