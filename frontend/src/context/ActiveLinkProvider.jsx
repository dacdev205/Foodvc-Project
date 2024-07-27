import React, { createContext, useState, useContext } from "react";

const ActiveLinkContext = createContext();

// eslint-disable-next-line react/prop-types
export const ActiveLinkProvider = ({ children }) => {
  const [activeLink, setActiveLink] = useState("");

  const value = {
    activeLink,
    setActiveLink,
  };

  return (
    <ActiveLinkContext.Provider value={value}>
      {children}
    </ActiveLinkContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useActiveLink = () => useContext(ActiveLinkContext);
