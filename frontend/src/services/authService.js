import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('hireflow_token', response.data.token);
      localStorage.setItem('hireflow_admin', JSON.stringify(response.data.admin));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('hireflow_token');
    localStorage.removeItem('hireflow_admin');
  },

  getCurrentAdmin: () => {
    const admin = localStorage.getItem('hireflow_admin');
    return admin ? JSON.parse(admin) : null;
  },

  getToken: () => {
    return localStorage.getItem('hireflow_token');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
