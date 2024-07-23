import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../App.css";
import LoadingSpinner from "../ultis/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const { loading } = useContext(AuthContext);
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <ToastContainer />
          <div>
            <div className="relative mb-16">
              <Navbar></Navbar>
            </div>
          </div>
          <div className="min-h-screen">
            <Outlet></Outlet>
          </div>
          <Footer></Footer>
        </div>
      )}
    </div>
  );
};

export default Main;
