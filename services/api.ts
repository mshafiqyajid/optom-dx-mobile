import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';
import { router } from 'expo-router';

// API Base URL - same as frontend
const API_BASE_URL = 'http://54.179.79.104:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear auth state
      await AsyncStorage.removeItem('token');
      // Clear Zustand store (access store directly outside React)
      useAuthStore.getState().clearAuth();

      // Redirect to login
      router.replace('/(auth)/login');
    }

    if (error.response?.status === 403) {
      // Forbidden - handle access denied
      console.error('Access denied');
    }

    return Promise.reject(error);
  }
);

export default api;
