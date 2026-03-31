import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants.js';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {      
          return Promise.reject(error);
    }   
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const isRefreshCall = originalRequest?.url?.includes('/api/token/refresh/');

        if (isUnauthorized && !isRefreshCall && !originalRequest?._retry) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem(REFRESH_TOKEN);
            if (!refresh) {
                return Promise.reject(error);
            }

            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
                    { refresh }
                );

                const newAccessToken = refreshResponse.data.access;
                localStorage.setItem(ACCESS_TOKEN, newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

