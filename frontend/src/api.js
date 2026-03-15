import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const services = {
  getAll: () => api.get('/services'),
};

export const bookings = {
  getAll: () => api.get('/bookings'),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
};

export const admin = {
  getStats: () => api.get('/admin/stats'),
};

export const payments = {
  createIntent: (amount) => api.post('/payments/create-payment-intent', { amount })
};

export default api;
