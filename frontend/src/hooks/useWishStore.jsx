import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserCurrent from "./useUserCurrent";

const useWishStore = () => {
  const userData = useUserCurrent();
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const id = userData?._id || "";
  const queryClient = useQueryClient();

  const refetchWishStore = async () => {
    if (!id) {
      return;
    }
    await queryClient.invalidateQueries(["wish-store", id]);
  };

  const { data: wishStore = [], isLoading } = useQuery({
    queryKey: ["wish-store", id],
    queryFn: async () => {
      if (!id) {
        return [];
      }
      try {
        const res = await fetch(`http://localhost:3000/wish-store/user/${id}`, {
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

  return [wishStore, refetchWishStore, isLoading];
};

export default useWishStore;