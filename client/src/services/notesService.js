import api from './api.js';

export const fetchNotes = (tripId) =>
  api.get(`/notes/${tripId}`).then((r) => r.data);
export const createNote = (tripId, data) =>
  api.post(`/notes/${tripId}`, data).then((r) => r.data);
export const updateNote = (tripId, noteId, data) =>
  api.put(`/notes/${tripId}/${noteId}`, data).then((r) => r.data);
export const deleteNote = (tripId, noteId) =>
  api.delete(`/notes/${tripId}/${noteId}`).then((r) => r.data);
