import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useReview = () => {
  const axiosPublic = useAxiosPublic();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const {
    data: reviews = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
  });

  return [reviews, loading, refetch];
};

export default useReview;
