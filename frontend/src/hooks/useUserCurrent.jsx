import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";
import useAxiosPublic from "./useAxiosPublic";

const useUserCurrent = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const getToken = () => localStorage.getItem("access-token");
  const token = getToken();
  const [isFetched, setIsFetched] = useState(false);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    if (user && token && !isFetched) {
      const fetchUserData = async () => {
        try {
          const response = await axiosPublic.get(
            `/users/getUserByEmail/${user.email}`,
            {
              headers: {
                authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = response.data;
          setUserData(userData);
          setIsFetched(true);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user, token, isFetched, axiosPublic]);

  return userData;
};

export default useUserCurrent;
