import api from './api.js';

export const uploadImage = (file, folder = 'traveloop/uploads') => {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('folder', folder);
  return api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
};
