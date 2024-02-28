import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useAdmin = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    refetch,
    data: isAdmin,
    isPending: isAdminLoading,
  } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    queryFn: async () => {
      if (!user || !user.email) {
        // Handle the case where user or user.email is undefined
        console.error("User or user email is undefined");
        return null; // or throw an error or handle it based on your logic
      }

      const res = await axiosSecure.get(`users/getAdmin/${user.email}`);
      return res.data?.admin;
    },
  });

  return [isAdmin, isAdminLoading];
};

export default useAdmin;
