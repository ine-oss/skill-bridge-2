import { api } from './api'

export const userService = {
  getMe: () => api.get('/users/me'),
  updateMe: (payload) => api.put('/users/me', payload),
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, payload) => api.put(`/users/${userId}`, payload),
  getJobSeekerProfile: () => api.get('/users/me/profile'),
  updateJobSeekerProfile: (payload) => api.put('/users/me/profile', payload),
  getEvidence: () => api.get('/users/me/evidence'),
  addEvidence: (payload) => api.post('/users/me/evidence', payload),
  deleteEvidence: (id) => api.delete(`/users/me/evidence/${id}`),
  getDashboard: () => api.get('/dashboard'),
  getVerification: () => api.get('/verification'),
  submitVerification: (details) => api.post('/verification', { details }),
}
