import requests from './httpService';

const ProductServices = {
  getAllProducts({ page, limit, category, title, price }) {
    const searchCategory = category !== null ? category : '';
    const searchTitle = title !== null ? title : '';
    const searchPrice = price !== null ? price : '';

    return requests.get(
       `/products?isDashboard=true&all=true&category=${searchCategory}&title=${searchTitle}&price=${searchPrice}`
    );
  },

  // /////////// all products without limit
  _getAllProducts() {
    return requests.get('/products/all');
  },
 

  getStockOutProducts() {
    return requests.get('/products/stock-out');
  },
 
  getProductById(id) {
    return requests.get(`/products/product/${id}`);
  },

  addProduct(body) {
    return requests.post('/products/add', body);
  },

  addAllProducts(body) {
    return requests.post('/products/all', body);
  },

  getProductsByCategory(id) {
    return requests.get(`/products/bycategory/${id}`);
  },

  updateProduct(id, body) {
    return requests.put(`/products/${id}`, body);
  },

  updateStatus(id, body) {
    return requests.put(`/products/status/${id}`, body);
  },

  deleteProduct(id) {
    return requests.delete(`/products/${id}`);
  },
};

export default ProductServices;
