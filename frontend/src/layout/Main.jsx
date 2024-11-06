import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { Outlet } from "react-router-dom";
import Navbar from "../components/LayoutDisplay/Navbar";
import Footer from "../components/LayoutDisplay/Footer";
import ContactAdmin from "../components/Helps/ContactAdmin";
import "../App.css";
import LoadingSpinner from "../ultis/LoadingSpinner";

const Main = () => {
  const { loading } = useContext(AuthContext);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const toggleContactAdmin = () => {
    setIsContactOpen((prev) => !prev);
  };

  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div>
            <div className="relative mb-16">
              <Navbar />
            </div>
          </div>
          <div className="min-h-screen">
            <Outlet context={{ toggleContactAdmin }} />
          </div>
          <Footer />

          <button
            onClick={toggleContactAdmin}
            className="fixed bottom-4 right-4 bg-green hover:bg-green text-white font-bold py-2 px-4 rounded-full shadow-lg focus:outline-none"
          >
            💬
          </button>

          {isContactOpen && (
            <div className="fixed scrollbar-thin scrollbar-webkit bottom-20 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-[90] h-96 p-4 z-50">
              <ContactAdmin />
              <button
                onClick={toggleContactAdmin}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                ✖
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Main;
