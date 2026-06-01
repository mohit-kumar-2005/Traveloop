import api from './api.js';

export const fetchCommunityTrips = (params) =>
  api.get('/community', { params }).then((r) => r.data);
export const likeTrip = (id) => api.post(`/community/${id}/like`).then((r) => r.data);
export const bookmarkTrip = (id) => api.post(`/community/${id}/save`).then((r) => r.data);
