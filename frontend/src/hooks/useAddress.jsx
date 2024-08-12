import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useAddress = (page = 1, limit = 2) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const queryClient = useQueryClient();
  const email = user?.email || "";

  const refetchAddress = async () => {
    if (!email) {
      return;
    }
    await queryClient.invalidateQueries(["address", email, page, limit]);
  };

  const { data: address = { addresses: [], totalPages: 0 }, isLoading } =
    useQuery({
      queryKey: ["address", email, page, limit],
      queryFn: async () => {
        if (!email) {
          return { addresses: [], totalPages: 0 };
        }
        const res = await fetch(
          `http://localhost:3000/address?email=${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          return { addresses: [], totalPages: 0 };
        }
        return res.json();
      },
    });

  return [address.addresses, address.totalPages, refetchAddress, isLoading];
};

export default useAddress;
