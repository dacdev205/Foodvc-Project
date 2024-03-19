import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useMessage2Admin = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: messages = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/messages");
      return res.data;
    },
  });

  return [messages, loading, refetch];
};

export default useMessage2Admin;
