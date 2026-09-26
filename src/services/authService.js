import { apiRequest } from './api'

export const authService = {
  login: async (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: async (payload) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  resetPassword: async (payload) => apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
