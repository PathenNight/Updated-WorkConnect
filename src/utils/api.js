import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an Axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials (cookies, etc.)
});

// Set up an interceptor to attach authentication tokens (if required)
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken'); // Retrieve token from localStorage
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Define API functions
const login = (email, password) =>
  api.post('/auth/login', { email, password });

const registerUser = (userData) =>
  api.post('/auth/register', userData);

const fetchSecurityQuestions = () =>
  api.get('/auth/security-questions');

const updateUser = (id, updatedData) =>
  api.put(`/auth/update/${id}`, updatedData);

const getTasks = (userId) =>
  api.get(`/tasks/${userId}`);

const createTask = (taskData) =>
  api.post('/tasks', taskData);

const getCalendarData = (year, month) =>
  api.get(`/calendar/${year}/${month}`);

const recoverByEmail = (email) =>
  api.post('/recover-by-email', { email });

const recoverByKey = (recoveryKey) =>
  api.post('/recover-by-key', { recoveryKey });

// Export the API functions
export default {
  login,
  registerUser,
  fetchSecurityQuestions,
  updateUser,
  getTasks,
  createTask,
  getCalendarData,
  recoverByEmail,
  recoverByKey,
};
