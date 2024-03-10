import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  axiosSecure.interceptors.request.use(
    async function (config) {
      try {
        // Do something before request is sent
        const token = localStorage.getItem("access-token");
        config.headers.authorization = `Bearer ${token}`;
        return config;
      } catch (error) {
        // Handle any errors during request preparation
        console.error("Error preparing request:", error);
        throw error;
      }
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      try {
        const status = error.response.status;

        if (status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      } catch (responseError) {
        // Handle any errors during response processing
        console.error("Error processing response:", responseError);
        throw responseError;
      }
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
