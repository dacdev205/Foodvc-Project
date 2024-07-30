import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAddress = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();

  const refetchAddress = async () => {
    if (!email) {
      return;
    }
    await queryClient.invalidateQueries(["address", email]);
  };
  const email = user?.email || "";
  const { data: address = [], isLoading } = useQuery({
    queryKey: ["address", email],
    queryFn: async () => {
      if (!email) {
        return [];
      }
      const res = await fetch(`http://localhost:3000/address?email=${email}`, {
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
  return [address, refetchAddress, isLoading];
};

export default useAddress;
