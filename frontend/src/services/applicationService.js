import api from './api';

export const applicationService = {
  // Public application submit
  submitApplication: async (formData) => {
    const response = await api.post('/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin
  getApplications: async (params = {}) => {
    const response = await api.get('/applications/admin', { params });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/admin/${id}`);
    return response.data;
  },

  updateStage: async (id, stageData) => {
    const response = await api.patch(`/applications/admin/${id}/stage`, stageData);
    return response.data;
  },

  addInterviewNote: async (id, noteData) => {
    const response = await api.post(`/applications/admin/${id}/notes`, noteData);
    return response.data;
  },

  triggerAIAnalysis: async (id) => {
    const response = await api.post(`/applications/admin/${id}/analyze`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/applications/admin/stats');
    return response.data;
  },
};
