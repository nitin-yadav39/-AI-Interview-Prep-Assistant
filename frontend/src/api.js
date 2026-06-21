import axios from 'axios';

const api = axios.create({
  // Point to relative path /api to work seamlessly in both local proxy dev and production build
  baseURL: '/api',
});

// Request interceptor to add the JWT token to the Authorization header
api.interceptors.request.use(
  (config) => {
    // Get the user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      // Check if we have a token stored in the parsed data or separately
      const token = parsedData.token || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
