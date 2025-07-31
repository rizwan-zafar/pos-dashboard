import requests from './httpService';

const ReviewServices= {
 addReview(body) {
    return requests.post('/reviews/add', body);
  },

  getAllReviews() {
    return requests.get('/reviews');
  },


  getReviewsById(id) {
    return requests.get(`/reviews/${id}`);
  },

  updateStatus(id, body) {
    return requests.put(`/reviews/status/${id}`, body);
  },

  deleteReview(id) {
    return requests.delete(`/reviews/${id}`);
  },
};

export default ReviewServices;
