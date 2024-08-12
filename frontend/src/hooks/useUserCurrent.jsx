import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "./useAuth";

const useUserCurrent = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("access-token");
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (user && token && !isFetched) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/getUserByEmail/${user.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
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
  }, [user, token, isFetched]);

  return userData;
};

export default useUserCurrent;
