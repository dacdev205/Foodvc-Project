import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";

const useWishList = () => {
  const userData = useUserCurrent();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const id = userData?._id || "";
  const queryClient = useQueryClient();

  const refetchWishList = async () => {
    if (!id) {
      return;
    }
    await queryClient.invalidateQueries(["wish-list", id]);
  };

  const { data: wishList = [], isLoading } = useQuery({
    queryKey: ["wish-list", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      try {
        const res = await fetch(`http://localhost:3000/wish-list/user/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 404) {
          return [];
        }

        if (!res.ok) {
          return [];
        }

        return await res.json();
      } catch (error) {
        return [];
      }
    },
  });

  return [wishList, refetchWishList, isLoading];
};

export default useWishList;
