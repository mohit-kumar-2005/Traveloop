import api from './api.js';

export const fetchCities = (params) =>
  api.get('/cities', { params }).then((r) => r.data);
export const fetchCity = (id) => api.get(`/cities/${id}`).then((r) => r.data);
export const fetchPopularCities = () =>
  api.get('/cities/popular').then((r) => r.data);
