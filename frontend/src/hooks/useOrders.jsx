import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const useOrders = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const email = user?.email || "";
  const {
    refetch,
    data: orders = [],
    isLoading,
  } = useQuery({
    queryKey: ["orders", email],
    queryFn: async () => {
      if (!email) {
        return [];
      }
      const res = await fetch(`http://localhost:3000/order?email=${email}`, {
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
  return [orders, refetch, isLoading];
};

export default useOrders;
