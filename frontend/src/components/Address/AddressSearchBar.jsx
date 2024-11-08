/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";

const AddressSearchBar = ({
  cities,
  onCitySelect,
  onDistrictSelect,
  onWardsSelect,
  districts,
  wards,
  selectedCity,
  selectedDistrict,
  selectedWard,
  selectedStreet,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const searchBarRef = useRef(null);

  useEffect(() => {
    setSearchTerm(`${selectedCity}, ${selectedDistrict}, ${selectedWard}`);
  }, [selectedCity, selectedDistrict, selectedWard, selectedStreet]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);

    const filteredCities = cities.filter((city) =>
      city.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredResults(filteredCities);
  };

  const handleCityClick = (city) => {
    onCitySelect(city);
    setSearchTerm(city);
  };

  const handleDistrictClick = (district) => {
    onDistrictSelect(district);
    setSearchTerm(`${searchTerm}, ${district}`);
  };

  const handleWardsClick = (ward) => {
    onWardsSelect(ward);
    setSearchTerm(`${searchTerm}, ${ward}`);
    setFilteredResults([]);
  };

  const handleClickOutside = (e) => {
    if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
      setFilteredResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className="relative search-bar">
      <input
        type="text"
        placeholder={"Tỉnh/Thành Phố, Quận/Huyện, Phường/Xã"}
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputChange}
        className="input input-bordered w-full text-black"
      />
      {filteredResults.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-2 flex text-black ">
          <div className="text-sm">
            <p className="py-2 px-4 ">Tỉnh/Thành phố</p>
            <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-webkit">
              {filteredResults.map((city, index) => (
                <li
                  key={index}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCityClick(city)}
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <p className="py-2 px-4 ">Quận/Huyện</p>
            <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-webkit">
              {districts.map((district, index) => (
                <li
                  key={index}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleDistrictClick(district)}
                >
                  {district}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm">
            <p className="py-2 px-4 ">Phường/Xã</p>
            <ul className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-webkit">
              {wards.map((ward, index) => (
                <li
                  key={index}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleWardsClick(ward)}
                >
                  {ward}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSearchBar;
