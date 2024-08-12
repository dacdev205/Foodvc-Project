import { CircularProgress } from "@mui/material";
import React from "react";
const LoadingSpinner = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <CircularProgress color="success" />
    </div>
  );
};

export default LoadingSpinner;
