/* eslint-disable react/prop-types */
import React from "react";

const FormattedPrice = ({ price }) => {
  const formattedPrice = () => {
    const priceNumber = new Intl.NumberFormat("vi-VN", {
      currency: "VND",
    }).format(price);

    const [, decimalPart] = priceNumber.split(",");

    // Check if the part after the decimal point is greater than or equal to 5
    if (decimalPart && parseInt(decimalPart) >= 5) {
      return new Intl.NumberFormat("vi-VN", {
        currency: "VND",
      }).format(Math.ceil(price));
    }

    return priceNumber;
  };

  return (
    <span className="text-black">
      {formattedPrice()} <span>₫</span>
    </span>
  );
};

export default FormattedPrice;
