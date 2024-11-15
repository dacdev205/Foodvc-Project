import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const PF = "http://localhost:3000";

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  // Fetch user/shop details with debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUserDetails = useCallback(
    debounce(async (name) => {
      if (name) {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/search-detail`,
            {
              params: { name },
            }
          );

          const users = response.data.data.users || [];
          const shops = response.data.data.shops || [];

          if (users.length > 0 || shops.length > 0) {
            const mergedResults = [...users, ...shops];
            setSearchResults(mergedResults);
            setNoResults(false);
          } else {
            setSearchResults([]);
            setNoResults(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setSearchResults([]);
            setNoResults(true);
          } else {
            console.error("Error fetching search results:", error);
          }
        }
      } else {
        setSearchResults([]);
        setNoResults(false);
      }
    }, 300),
    []
  );

  const handleIconClick = () => {
    setIsExpanded(true);
    fetchUserDetails(searchText);
  };

  const handleClearInput = () => {
    setSearchText("");
    setSearchResults([]);
    setNoResults(false);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setIsExpanded(false);
      setSearchText("");
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
    fetchUserDetails(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchUserDetails(searchText);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute right-4 mt-1 bg-transparent z-40">
      <div className="relative" ref={inputRef}>
        <span
          onClick={handleIconClick}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-black cursor-pointer"
        >
          <FaSearch />
        </span>

        <input
          type="text"
          value={searchText}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className={`${
            isExpanded ? "w-[200px] px-8" : "w-8 pl-8"
          } py-1 border rounded-full focus:outline-none transition-all duration-300`}
          placeholder="Tìm kiếm..."
        />

        {searchText && (
          <span
            onClick={handleClearInput}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          >
            <FaTimes />
          </span>
        )}

        {isExpanded && searchResults?.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
            {searchResults.map((result) => (
              <div
                key={result._id}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() =>
                  navigate(`/results/${result._id}`, { state: { result } })
                }
              >
                {result?.photoURL ? (
                  <img
                    src={result.photoURL}
                    alt={result.name || result.shopName}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                ) : (
                  <img
                    src={
                      result.shop_image
                        ? `${PF}/${result.shop_image}`
                        : "/images/user.png"
                    }
                    alt={result.name || result.shopName}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                )}

                <div>
                  <p className="text-black font-semibold">
                    {result.name?.slice(0, 14) || result.shopName?.slice(0, 14)}
                    ...
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Display no results message */}
        {isExpanded && searchResults.length === 0 && noResults && (
          <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
            <div className="p-2 text-gray-500 text-center text-sm">
              Không tìm thấy kết quả nào.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
