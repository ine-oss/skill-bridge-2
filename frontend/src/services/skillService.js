import { api } from './api'

export const skillService = {
  getSkills: () => api.get('/skills'),
  getMySkills: () => api.get('/skills/me'),
  updateMySkills: (skills) => api.put('/skills/me', { skills }), // [{ name, level, score }]
  getSkillGap: (userId = 'me', jobId) => api.get(`/skills/gap/${userId}`, { jobId }),
  addSkill: (payload) => api.post('/skills', payload), // admin
  deleteSkill: (id) => api.delete(`/skills/${id}`), // admin
}
