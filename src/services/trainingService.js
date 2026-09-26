import { apiRequest } from './api'

export const trainingService = {
  getPrograms: async () => apiRequest('/training'),
  getProgramById: async (id) => apiRequest(`/training/${id}`),
  createProgram: async (payload) => apiRequest('/training', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
