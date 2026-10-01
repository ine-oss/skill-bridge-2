import { api } from './api'

export const companyService = {
  getCompanies: (params) => api.get('/companies', params),
  getCompany: (idOrSlug) => api.get(`/companies/${idOrSlug}`),
  getMyCompany: () => api.get('/companies/me'),
  updateMyCompany: (payload) => api.put('/companies/me', payload),
}
