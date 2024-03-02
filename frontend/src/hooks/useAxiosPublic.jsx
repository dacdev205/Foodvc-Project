import React from "react";
import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "https://foodvc-server.onrender.com",
  maxRedirects: 0,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
