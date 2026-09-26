import { apiRequest } from './api'

export const applicationService = {
  getApplications: async () => apiRequest('/applications'),
  submitApplication: async (payload) => apiRequest('/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
