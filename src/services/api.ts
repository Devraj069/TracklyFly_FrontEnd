import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor for attaching auth token
api.interceptors.request.use((config) => {
    const savedUser = localStorage.getItem('trackyfly_user');
    if (savedUser) {
        const { token } = JSON.parse(savedUser);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for better error handling/logging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            console.error('Network Error - Is the backend running at http://localhost:8080?', error);
        } else {
            console.error('API Error Response:', error.response);
        }
        return Promise.reject(error);
    }
);

export default api;
