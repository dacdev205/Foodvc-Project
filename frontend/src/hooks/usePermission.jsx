import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const usePermission = (permissionNames = []) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    refetch,
    data: permissions = [],
    isLoading: isPermissionLoading,
  } = useQuery({
    queryKey: [user?.email, "permissions"],
    queryFn: async () => {
      if (!user || !user.email) {
        console.error("User or user email is undefined");
        return [];
      }

      try {
        const res = await axiosSecure.get(
          `/users/getPermissions/${user.email}`
        );
        const userPermissions = res.data?.permissions || [];
        return userPermissions.map((perm) => perm.name);
      } catch (error) {
        console.error("Error fetching permissions", error);
        return [];
      }
    },
  });

  const rolePermission = Array.isArray(permissionNames)
    ? permissionNames.map((name) => permissions.includes(name))
    : [];

  return [rolePermission, isPermissionLoading, refetch];
};

export default usePermission;
