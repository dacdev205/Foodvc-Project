import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";

const useOrders = (
  searchTerm = "",
  filterType = "orderCode",
  page = 1,
  limit = 5
) => {
  const userData = useUserCurrent();
  const token = localStorage.getItem("access-token");
  const id = userData?._id || "";

  const {
    refetch,
    data: orders = { orders: [] },
    isLoading,
  } = useQuery({
    queryKey: ["orders", id, searchTerm, filterType, page, limit],
    queryFn: async () => {
      if (!id) {
        return { orders: [] };
      }
      const res = await fetch(`http://localhost:3000/order/order-user/${id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params: { searchTerm, filterType, page, limit },
      });
      if (!res.ok) {
        return { orders: [] };
      }
      return res.json();
    },
  });

  return [orders.orders, orders.totalPages, refetch, isLoading, page];
};

export default useOrders;
