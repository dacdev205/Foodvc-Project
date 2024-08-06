import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Outlet } from "react-router-dom";
import Navbar from "../components/LayoutDisplay/Navbar";
import Footer from "../components/LayoutDisplay/Footer";
import "../App.css";
import LoadingSpinner from "../ultis/LoadingSpinner";

const Main = () => {
  const { loading } = useContext(AuthContext);
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
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
