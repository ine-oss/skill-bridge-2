import { api } from './api'

export const jobService = {
  getJobs: (params) => api.get('/jobs', params), // { q, mode, type, industry, skill, company, page, limit }
  getJobById: (id) => api.get(`/jobs/${id}`),
  getMyJobs: (params) => api.get('/jobs/mine', params),
  getMatchedJobs: (params) => api.get('/jobs/matched', params),
  createJob: (payload) => api.post('/jobs', payload),
  updateJob: (id, payload) => api.patch(`/jobs/${id}`, payload),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  saveJob: (id) => api.post(`/jobs/${id}/save`),
  unsaveJob: (id) => api.delete(`/jobs/${id}/save`),
  getSavedJobs: () => api.get('/saved-jobs'),
}
