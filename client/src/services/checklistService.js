import api from './api.js';

export const fetchChecklist = (tripId) =>
  api.get(`/checklist/${tripId}`).then((r) => r.data);
export const addChecklistItem = (tripId, data) =>
  api.post(`/checklist/${tripId}`, data).then((r) => r.data);
export const updateChecklistItem = (tripId, itemId, data) =>
  api.put(`/checklist/${tripId}/${itemId}`, data).then((r) => r.data);
export const deleteChecklistItem = (tripId, itemId) =>
  api.delete(`/checklist/${tripId}/${itemId}`).then((r) => r.data);
