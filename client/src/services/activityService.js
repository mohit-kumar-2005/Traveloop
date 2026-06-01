import api from './api.js';

export const fetchActivities = (params) =>
  api.get('/activities', { params }).then((r) => r.data);
export const fetchActivity = (id) => api.get(`/activities/${id}`).then((r) => r.data);
