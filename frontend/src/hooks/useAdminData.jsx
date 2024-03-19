import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
const useAdminData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/getUserByEmail/${user.email}`
          );
          const userData = response.data;
          setUserData(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  return userData;
};

export default useAdminData;
