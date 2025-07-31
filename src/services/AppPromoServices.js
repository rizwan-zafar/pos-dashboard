import requests from "./httpService";

const PromoBannerServices = {
  getAllPromoBanner() {
    return requests.get("/promo-banners");
  },

  getPromoBannerById(id) {
    console.log("???????????? ", id);

    return requests.get(`/promo-banners/${id}`);
  },

  updateStatus(id, body) {
    return requests.put(`/promo-banners/status/${id}`, body);
  },

  addPromoBanner(body) {
    return requests.post("/promo-banners", body);
  },

  updatePromoBanner(id, body) {
    return requests.put(`/promo-banners/${id}`, body);
  },

  deletePromoBanner(id) {
    return requests.delete(`/promo-banners/${id}`);
  },
};

export default PromoBannerServices;
