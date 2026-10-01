import { api } from './api'

export const trainingService = {
  getPrograms: (params) => api.get('/training', params),
  getProgramById: (id) => api.get(`/training/${id}`),
  getMyPrograms: () => api.get('/training/mine'),
  createProgram: (payload) => api.post('/training', payload),
  updateProgram: (id, payload) => api.patch(`/training/${id}`, payload),
  deleteProgram: (id) => api.delete(`/training/${id}`),
  enroll: (id) => api.post(`/training/${id}/enroll`),
  getEnrollments: (params) => api.get('/enrollments', params),
  updateEnrollment: (id, payload) => api.patch(`/enrollments/${id}`, payload),
  getCertificates: () => api.get('/certificates'),
  verifyCertificate: (code) => api.get(`/certificates/verify/${code}`),
  getProviderProfile: () => api.get('/training/me'),
  updateProviderProfile: (payload) => api.put('/training/me', payload),
}
