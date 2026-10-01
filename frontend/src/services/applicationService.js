import { api } from './api'

export const applicationService = {
  getApplications: (params) => api.get('/applications', params), // { status, jobId, page, limit }
  getApplication: (id) => api.get(`/applications/${id}`),
  submitApplication: (payload) => api.post('/applications', payload), // { jobId, coverLetter, resumeUrl }
  updateStatus: (id, status, note) => api.patch(`/applications/${id}`, { status, note }),
  withdraw: (id) => api.patch(`/applications/${id}`, { status: 'WITHDRAWN' }),
  getInterviews: (params) => api.get('/interviews', params),
  scheduleInterview: (payload) => api.post('/interviews', payload),
  updateInterview: (id, payload) => api.patch(`/interviews/${id}`, payload),
}
