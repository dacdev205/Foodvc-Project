import React, { useEffect, useState } from "react";
import axios from "axios";

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Fetch reviews from your API
    axios
      .get("http://localhost:3000/reviews")
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the reviews!", error);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/reviews/${id}`)
      .then((response) => {
        setReviews(reviews.filter((review) => review._id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the review!", error);
      });
  };

  const handleEdit = (id, updatedReview) => {
    axios
      .put(`http://localhost:3000/reviews/${id}`, updatedReview)
      .then((response) => {
        setReviews(
          reviews.map((review) => (review._id === id ? response.data : review))
        );
      })
      .catch((error) => {
        console.error("There was an error updating the review!", error);
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Reviews Management
      </h1>
      <table className="min-w-full bg-white border border-green-200">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-green-100 border-b border-green-200">
              User Name
            </th>
            <th className="py-2 px-4 bg-green-100 border-b border-green-200">
              Rating
            </th>
            <th className="py-2 px-4 bg-green-100 border-b border-green-200">
              Comment
            </th>
            <th className="py-2 px-4 bg-green-100 border-b border-green-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="border-b border-green-200">
              <td className="py-2 px-4">{review.userName}</td>
              <td className="py-2 px-4">{review.rating}</td>
              <td className="py-2 px-4">{review.comment}</td>
              <td className="py-2 px-4">
                <button
                  className="bg-green-500 text-white py-1 px-2 rounded mr-2 hover:bg-green-600"
                  onClick={() =>
                    handleEdit(review._id, {
                      ...review,
                      comment: "Updated comment",
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                  onClick={() => handleDelete(review._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsManagement;
