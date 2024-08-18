import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";

const usePayment = () => {
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const userData = useUserCurrent();
  const id = userData?._id || "";
  const {
    refetch,
    data: payment = [],
    isLoading,
  } = useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      const res = await fetch(`http://localhost:3000/check-out/${id}`, {
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
  return [payment, refetch, isLoading];
};

export default usePayment;
