import api from './api.js';

export const fetchAdminStats = () => api.get('/admin/stats').then((r) => r.data);
export const fetchAdminUsers = () => api.get('/admin/users').then((r) => r.data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
export const promoteAdminUser = (id) =>
  api.put(`/admin/users/${id}/promote`).then((r) => r.data);
export const fetchAdminTrips = () => api.get('/admin/trips').then((r) => r.data);
export const fetchAdminPopularCities = () =>
  api.get('/admin/cities/popular').then((r) => r.data);
export const fetchAdminPopularActivities = () =>
  api.get('/admin/activities/popular').then((r) => r.data);
export const fetchTripsPerMonth = () =>
  api.get('/admin/analytics/trips-per-month').then((r) => r.data);
export const fetchTripStatusDistribution = () =>
  api.get('/admin/analytics/trip-status').then((r) => r.data);
export const fetchSignupsOverTime = () =>
  api.get('/admin/analytics/signups').then((r) => r.data);
