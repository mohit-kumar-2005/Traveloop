import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error.response?.data?.message || error.message || 'Network error';
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      window.dispatchEvent(new CustomEvent('traveloop:unauthorized'));
    }
    return Promise.reject({ ...error, friendlyMessage: msg });
  }
);

export default api;
