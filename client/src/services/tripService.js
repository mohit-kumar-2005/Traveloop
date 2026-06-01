import api from './api.js';

export const fetchTrips = (params) =>
  api.get('/trips', { params }).then((r) => r.data);
export const fetchTrip = (id) => api.get(`/trips/${id}`).then((r) => r.data);
export const createTrip = (data) => api.post('/trips', data).then((r) => r.data);
export const updateTrip = (id, data) => api.put(`/trips/${id}`, data).then((r) => r.data);
export const deleteTrip = (id) => api.delete(`/trips/${id}`).then((r) => r.data);
export const duplicateTrip = (id) => api.post(`/trips/${id}/duplicate`).then((r) => r.data);
export const fetchPublicTripBySlug = (slug) =>
  api.get(`/trips/public/${slug}`).then((r) => r.data);

export const addStop = (tripId, data) =>
  api.post(`/trips/${tripId}/stops`, data).then((r) => r.data);
export const updateStop = (tripId, stopId, data) =>
  api.put(`/trips/${tripId}/stops/${stopId}`, data).then((r) => r.data);
export const deleteStop = (tripId, stopId) =>
  api.delete(`/trips/${tripId}/stops/${stopId}`).then((r) => r.data);
export const reorderStops = (tripId, order) =>
  api.put(`/trips/${tripId}/stops/reorder`, { order }).then((r) => r.data);
export const addActivityToStop = (tripId, stopId, activityId) =>
  api
    .post(`/trips/${tripId}/stops/${stopId}/activities`, { activityId })
    .then((r) => r.data);
export const removeActivityFromStop = (tripId, stopId, actId) =>
  api.delete(`/trips/${tripId}/stops/${stopId}/activities/${actId}`).then((r) => r.data);
