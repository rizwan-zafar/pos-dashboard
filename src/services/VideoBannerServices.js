import requests from './httpService';

const VideoBannerServices = {
  // Add a new video banner
  addVideoBanner(body) {
    
    return requests.post('/videobanners', body);
  },
 getAllBanner() {
    return requests.get('/videobanners');
  },


  getBannerById(id) {
    return requests.get(`/videobanners/${id}`);
  },

  updateStatus(id, body) {
    return requests.put(`/videobanners/status/${id}`, body);
  },

    updateBanner(id, body) {
    return requests.put(`/videobanners/${id}`, body);
  },


  deleteBanner(id) {
    return requests.delete(`/videobanners/${id}`);
  },


}

export default VideoBannerServices;
