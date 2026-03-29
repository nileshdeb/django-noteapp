import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL 
});

api.interceptors.request.use(
    (config) => {
        const Token = localStorage.getItem(ACCESS_TOKEN);
        if (Token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (error) => {      
          return Promise.reject(error);
    }   
)

