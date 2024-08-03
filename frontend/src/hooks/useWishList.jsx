import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";

const useWishList = () => {
  const userData = useUserCurrent();
  const token = localStorage.getItem("access-token");
  const id = userData?._id || "";
  const queryClient = useQueryClient();

  const refetchWishList = async () => {
    if (!id) {
      return;
    }
    await queryClient.invalidateQueries(["wish-list", id]);
  };

  const { data: wishList = [], isLoading } = useQuery({
    queryKey: ["wish-list", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      const res = await fetch(`http://localhost:3000/wish-list/user/${id}`, {
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

  return [wishList, refetchWishList, isLoading];
};

export default useWishList;
