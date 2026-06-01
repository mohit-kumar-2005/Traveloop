import api from './api.js';

export const fetchBudget = (tripId) =>
  api.get(`/budget/${tripId}`).then((r) => r.data);
export const saveBudget = (tripId, data) =>
  api.put(`/budget/${tripId}`, data).then((r) => r.data);
