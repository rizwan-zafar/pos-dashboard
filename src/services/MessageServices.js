import requests from "./httpService";

const MessageServices = {
  getAllMessages(body) {
    return requests.get(`/messages/all`, body);
  },
  updateMessageStatus(id, body) {
    return requests.put(`/messages/status/${id}`, body);
  },

  deleteMessage(id) {
    return requests.delete(`/messages/delete/${id}`);
  },
}; 



export default MessageServices;
