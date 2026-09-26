import { apiRequest } from './api'

export const skillService = {
  getSkills: async () => apiRequest('/skills'),
  getSkillGap: async (userId) => apiRequest(`/skills/gap/${userId}`),
  addSkill: async (payload) => apiRequest('/skills', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
}
