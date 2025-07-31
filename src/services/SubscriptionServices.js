import requests from "./httpService";

const SubscriptionServices = {
  getAllSubscriptions(body) {
    return requests.get(`/subscriptions/all`, body);
  },
  updateSubscriptionStatus(id, body) {
    return requests.put(`/subscriptions/status/${id}`, body);
  },

  deleteSubscription(id) {
    console.log(id);
    
    return requests.delete(`/subscriptions/delete/${id}`);
  },
}; 



export default SubscriptionServices;
