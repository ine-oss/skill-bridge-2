import { api } from './api'

export const messageService = {
  getConversations: () => api.get('/messages'),
  getThread: (userId) => api.get(`/messages/${userId}`),
  send: (recipientId, body) => api.post('/messages', { recipientId, body }),
}

export const notificationService = {
  getNotifications: (params) => api.get('/notifications', params),
  markRead: (id, read = true) => api.patch(`/notifications/${id}`, { read }),
  markAllRead: () => api.post('/notifications/read-all'),
  remove: (id) => api.delete(`/notifications/${id}`),
}
