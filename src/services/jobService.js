import { apiRequest } from './api'

export const jobService = {
  getJobs: async () => apiRequest('/jobs'),
  getJobById: async (id) => apiRequest(`/jobs/${id}`),
  createJob: async (payload) => apiRequest('/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
