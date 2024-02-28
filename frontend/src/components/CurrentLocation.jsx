import React, { useState, useEffect } from "react";

const CurrentLocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <p>
          Vị trí hiện tại của bạn: {latitude}, {longitude}
        </p>
      )}
    </div>
  );
};

export default CurrentLocation;
