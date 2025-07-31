import requests from "./httpService";

const UserServices = {
  getAllUsers(body) {
    return requests.get(`/user`, body);
  },
  getUserById(id) {
    return requests.get(`/user/${id}`);
  },
   updateUserStatus(id, body) {
    return requests.put(`/user/status/${id}`, body);
  },
  deleteUser(id) {
    return requests.delete(`/user/${id}`);
  },
}; 

export default UserServices;
