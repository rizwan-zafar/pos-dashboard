import requests from './httpService';

const BannerServices = {
  getAllBanner() {
    return requests.get('/banners');
  },


  getBannerById(id) {
    return requests.get(`/banners/${id}`);
  },

  updateStatus(id, body) {
    return requests.put(`/banners/status/${id}`, body);
  },

  addBanner(body) {
    return requests.post('/banners', body);
  },


  updateBanner(id, body) {
    return requests.put(`/banners/${id}`, body);
  },


  deleteBanner(id) {
    return requests.delete(`/banners/${id}`);
  },
};

export default BannerServices;
