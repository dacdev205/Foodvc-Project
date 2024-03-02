import axios from "axios";
const url = "https://foodvc-server.onrender.com/reviews"

export default class reviewAPI {
    static async getProductById(id){
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }
    
    static async addReview(review) {
        try {
          const res = await axios.post(url, review);
          return res.data;
        } catch (error) {
          console.error('Error adding review:', error);
          throw error; 
        }
      }
    static async deleteCommentByReviewId(reviewId){
        const res = await axios.delete(`${url}/${reviewId}`);
        return res.data;
    }
    static async updateReviewByReviewId(reviewId, updateData) {
      try {
        const res = await axios.patch(`${url}/${reviewId}`, updateData);
        return res.data;
      } catch (error) {
        console.error('Error updating review:', error);
        throw error;
      }
    }
    static async getReviewById(id){
      const res = await axios.get(`https://foodvc-server.onrender.com/reviews/editReview/${id}`);
      return res.data;
  }
}