import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const usePermission = (permission) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    refetch,
    data: hasPermission,
    isLoading: isPermissionLoading,
  } = useQuery({
    queryKey: [user?.email, "permissions", permission],
    queryFn: async () => {
      if (!user || !user.email) {
        console.error("User or user email is undefined");
        return false;
      }

      try {
        const res = await axiosSecure.get(`users/getPermissions/${user.email}`);
        const permissions = res.data?.permissions || [];
        return permissions.includes(permission);
      } catch (error) {
        console.error("Error fetching permissions", error);
        return false;
      }
    },
  });

  return [hasPermission, isPermissionLoading, refetch];
};

export default usePermission;
