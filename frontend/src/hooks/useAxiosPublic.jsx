import React from "react";
import axios from "axios";
const axiosPublic = axios.create({
  baseURL: "http://localhost:3000",
  maxRedirects: 0,
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;
