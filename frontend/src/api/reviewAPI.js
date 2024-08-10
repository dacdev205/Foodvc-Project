import axios from "axios";
const url = "http://localhost:3000/reviews";
const token = localStorage.getItem("access-token");

export default class reviewAPI {
  static async getProductById(id) {
    const res = await axios.get(`${url}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }

  static async addReview(review) {
    try {
      const res = await axios.post(url, review, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  }

  static async updateReviewByReviewId(reviewId, updateData) {
    try {
      const res = await axios.patch(`${url}/${reviewId}`, updateData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }
  static async getReviewById(id) {
    const res = await axios.get(
      `http://localhost:3000/reviews/editReview/${id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }
}
