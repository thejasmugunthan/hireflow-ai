import api from './api';

export const jobService = {
  // Public
  getActiveJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Admin
  getAllJobsAdmin: async () => {
    const response = await api.get('/jobs/admin/all');
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs/admin', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/admin/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/admin/${id}`);
    return response.data;
  },
};
