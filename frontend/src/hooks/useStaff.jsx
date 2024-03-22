import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useStaff = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const {
    refetch,
    data: isStaff,
    isPending: isStaffLoading,
    isError: isStaffError,
  } = useQuery({
    queryKey: [user?.email, "isStaff"],
    queryFn: async () => {
      if (!user || !user.email) {
        throw new Error("User or user email is undefined");
      }

      try {
        const res = await axiosSecure.get(`users/getStaff/${user.email}`);
        return res.data?.staff;
      } catch (error) {
        throw new Error("Error fetching staff data");
      }
    },
  });

  return [isStaff, isStaffLoading, isStaffError];
};

export default useStaff;
