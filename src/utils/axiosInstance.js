import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-ndolv2.nongdanonline.cc',
});

// Gắn token vào request header nếu có
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // hoặc Cookies.get('token') nếu bạn dùng cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;