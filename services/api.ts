import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth-store';
import { useUIStore } from '@/store/ui-store';
import { router } from 'expo-router';
import type { ApiError, NetworkError } from './types.errors';

// API Base URL - uses environment variable with fallback
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Transform axios error into structured API error
 */
function createApiError(error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>): ApiError {
  const status = error.response?.status || 500;
  const data = error.response?.data;

  return {
    message: data?.message || getDefaultErrorMessage(status),
    errors: data?.errors,
    status,
  };
}

/**
 * Create network error object
 */
function createNetworkError(message: string): NetworkError {
  return {
    message,
    isNetworkError: true,
  };
}

/**
 * Get default error message based on status code
 */
function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 422:
      return 'Please correct the validation errors.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 502:
    case 503:
    case 504:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

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
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    // Handle network errors (no response)
    if (!error.response) {
      const networkError = createNetworkError(
        error.code === 'ECONNABORTED'
          ? 'Request timed out. Please check your connection.'
          : 'Unable to connect to the server. Please check your internet connection.'
      );

      // Show toast for network errors
      useUIStore.getState().showToast(networkError.message, 'error', 5000);

      return Promise.reject(networkError);
    }

    const status = error.response.status;
    const apiError = createApiError(error);

    // Handle specific status codes
    switch (status) {
      case 401:
        // Unauthorized - clear auth state
        await AsyncStorage.removeItem('token');
        // Clear Zustand store (access store directly outside React)
        useAuthStore.getState().clearAuth();
        // Redirect to login
        router.replace('/(auth)/login');
        break;

      case 403:
        // Forbidden - show access denied toast
        useUIStore.getState().showToast(apiError.message, 'error');
        break;

      case 404:
        // Not found - log but don't show toast (let caller handle)
        break;

      case 422:
        // Validation error - let caller handle (form errors)
        break;

      case 429:
        // Rate limited - show warning toast
        useUIStore.getState().showToast(apiError.message, 'warning', 5000);
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors - show error toast
        useUIStore.getState().showToast(apiError.message, 'error', 5000);
        break;

      default:
        // Other errors - log for debugging
        if (__DEV__) {
          console.error(`API Error [${status}]:`, apiError.message);
        }
    }

    return Promise.reject(apiError);
  }
);

export default api;

// Re-export error utilities for convenience
export { getErrorMessage, getValidationErrors, isApiError, isNetworkError, isValidationError } from './types.errors';
export type { ApiError, NetworkError, ValidationError } from './types.errors';
