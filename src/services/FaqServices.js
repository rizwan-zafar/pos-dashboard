import requests from './httpService';

const FaqServices = {
  addFaqs(body) {
    return requests.post('/faqs/add', body);
  },

  getAllFaqs() {
    return requests.get('/faqs/all');
  },

  getFaqById(id) {
    return requests.get(`/faqs/get/${id}`);
  },

  updateFaq(id, body) {
    return requests.put(`/faqs/update/${id}`, body);
  },

  deleteFaq(id, body) {
    return requests.delete(`/faqs/delete/${id}`, body);
  },
};

export default FaqServices;
