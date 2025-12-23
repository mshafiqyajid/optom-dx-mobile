import { useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import AuthAPI from './api.auth';
import {
  LoginRequest,
  RegisterRequest,
  ResendVerificationRequest,
} from './type.auth';
import { useAuthStore } from '@/store/auth-store';

const key = 'Auth';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthAPI.login(credentials),
    onSuccess: async (data) => {
      // Store token in AsyncStorage (for API interceptor)
      await AsyncStorage.setItem('token', data.token);
      // Store user data in Zustand (for UI components)
      setAuth(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: [key] });
      // Navigate to home
      router.replace('/(tabs)');
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => AuthAPI.logout(),
    onSuccess: async () => {
      await AsyncStorage.removeItem('token');
      clearAuth();
      queryClient.clear();
      // Navigate to login
      router.replace('/(auth)/login');
    },
    onError: async (error) => {
      console.error('Logout error:', error);
      // Even on error, clear local state and redirect
      await AsyncStorage.removeItem('token');
      clearAuth();
      queryClient.clear();
      router.replace('/(auth)/login');
    }
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => AuthAPI.register(data),
    onError: (error) => {
      console.error('Register error:', error);
    }
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (data: ResendVerificationRequest) => AuthAPI.resendVerification(data),
    onError: (error) => {
      console.error('Resend verification error:', error);
    }
  });
};
