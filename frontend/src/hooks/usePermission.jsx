import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const usePermission = (permissionName) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    refetch,
    data: permissions,
    isLoading: isPermissionLoading,
  } = useQuery({
    queryKey: [user?.email, "permissions"],
    queryFn: async () => {
      if (!user || !user.email) {
        console.error("User or user email is undefined");
        return [];
      }

      try {
        const res = await axiosSecure.get(`users/getPermissions/${user.email}`);
        const userPermissions = res.data?.permissions || [];
        return userPermissions;
      } catch (error) {
        console.error("Error fetching permissions", error);
        return [];
      }
    },
  });

  const hasPermission = permissions?.some(
    (permission) => permission.name === permissionName
  );

  return [hasPermission, isPermissionLoading, refetch];
};

export default usePermission;
