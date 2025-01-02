// src/api/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5131/api'; // Замість цього ставте вашу базову URL адресу API

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Витягнути токен з локального сховища
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
