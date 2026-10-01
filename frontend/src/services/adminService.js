import { api } from './api'

export const adminService = {
  getUsers: (params) => api.get('/admin/users', params),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getVerifications: (status) => api.get('/admin/verifications', { status }),
  reviewVerification: (id, status, reviewerNote) => api.patch(`/admin/verifications/${id}`, { status, reviewerNote }),
  getAuditLogs: (params) => api.get('/admin/audit-logs', params),
  getAllJobs: (params) => api.get('/jobs', { status: 'ALL', ...params }),
  getAllPrograms: (params) => api.get('/training', { status: 'ALL', ...params }),
  getAnalytics: (months = 6) => api.get('/admin/analytics', { months }),
}
