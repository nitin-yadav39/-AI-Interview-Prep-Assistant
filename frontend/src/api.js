import axios from 'axios';

const api = axios.create({
  // Point to local backend for development, can be configured via environment variables
  baseURL: 'http://localhost:5000/api',
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
