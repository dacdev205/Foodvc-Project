import React, { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../App.css";
import LoadingSpinner from "../components/LoadingSpinner";
const Main = () => {
  const { user } = useContext(AuthContext);
  const { loading } = useContext(AuthContext);
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div>
            <div className="relative">
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
