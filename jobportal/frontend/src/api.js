// api.js - All API calls to the backend

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── User APIs ────────────────────────────────────────────────────────────────

export const registerUser = (userData) => API.post('/users/register', userData);
export const loginUser = (credentials) => API.post('/users/login', credentials);

// ─── Job APIs ─────────────────────────────────────────────────────────────────

export const getAllJobs = () => API.get('/jobs');
export const getJobById = (jobId) => API.get(`/jobs/${jobId}`);
export const getEmployerJobs = () => API.get('/jobs/employer/all');
export const createJob = (jobData) => API.post('/jobs', jobData);
export const updateJob = (jobId, jobData) => API.put(`/jobs/${jobId}`, jobData);
export const deleteJob = (jobId) => API.delete(`/jobs/${jobId}`);

// ─── Application APIs ─────────────────────────────────────────────────────────

export const applyForJob = (formData) => {
  return API.post('/applications/apply', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getUserApplications = () => API.get('/applications/user');
export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (appId, status) => API.put(`/applications/${appId}/status`, { status });
