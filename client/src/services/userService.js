import api from './api.js';

export const fetchProfile = () => api.get('/users/profile').then((r) => r.data);
export const updateProfile = (data) => api.put('/users/profile', data).then((r) => r.data);
export const deleteAccount = () => api.delete('/users/profile').then((r) => r.data);
export const uploadProfilePhoto = (formData) =>
  api
    .post('/users/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data);
export const changePassword = (data) =>
  api.put('/users/password', data).then((r) => r.data);
