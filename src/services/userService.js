import { apiRequest } from './api'

export const userService = {
  getProfile: async (userId) => apiRequest(`/users/${userId}`),
  updateProfile: async (userId, payload) => apiRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
}
