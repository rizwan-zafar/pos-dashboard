import requests from './httpService';

const OrderServices = {
  getAllOrders({ body, headers, contact, status, page = 1, limit = 8, day }) {
    const searchContact = contact !== null ? contact : '';
    const searchStatus = status !== null ? status : '';
    const searchDay = day !== null ? day : '';

    return requests.get( 
      `/orders?contact=${searchContact}&status=${searchStatus}&day=${searchDay}&page=${page}&limit=${limit}`,
      body,
      headers
    );
  },

  getRecentOrders({
    page = 1,
    limit = 8,
    startDate = '1:00',
    endDate = '23:59',
  }) {
    return requests.get(
      `/orders/recent?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    );
  },

  getOrderAndSalesChart({ startDate = '1:00', endDate = '23:59' }) {
    return requests.get(
      `/orders/sales/chart?startDate=${startDate}&endDate=${endDate}`
    );
  },

  getBestSellerProductChart() {
    return requests.get('/orders/best-seller/chart');
  },

  getDashboardOrdersData({ page = 1, limit = 8 }) {
    return requests.get(`/orders/dashboard?page=${page}&limit=${limit}`);
  },

  getOrderByUser(id, body) {
    return requests.get(`/orders/user/${id}`, body);
  },

  getOrderById(id, body) {
    return requests.get(`/orders/${id}`, body);
  },

  updateOrder(id, body, headers) {
    return requests.put(`/orders/${id}`, body, headers);
  },

  deleteOrder(id) {
    return requests.delete(`/orders/${id}`);
  },
};

export default OrderServices;
