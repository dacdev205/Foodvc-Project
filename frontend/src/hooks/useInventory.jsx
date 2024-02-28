import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useInventory = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: inventory = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const res = await axiosPublic.get("/inventory");
      return res.data;
    },
  });

  return [inventory, loading, refetch];
};

export default useInventory;
