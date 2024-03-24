/* eslint-disable react/prop-types */
import React from "react";

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center my-8">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`mx-1 px-3 py-1 rounded-full ${
            currentPage === number ? "bg-green text-white" : "bg-gray-200"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
