import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";

const usePayment = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");

  const email = user?.email || "";
  const {
    refetch,
    data: payment = [],
    isLoading,
  } = useQuery({
    queryKey: ["payment", email],
    queryFn: async () => {
      if (!email) {
        return [];
      }
      const res = await fetch(
        `http://localhost:3000/check-out?email=${email}`,
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
  return [payment, refetch, isLoading];
};

export default usePayment;
