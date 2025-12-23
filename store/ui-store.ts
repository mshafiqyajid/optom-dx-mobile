import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UIState {
  // Global loading state
  isLoading: boolean;
  loadingMessage: string | null;

  // Global error state
  error: string | null;

  // Toast notifications queue
  toasts: Toast[];

  // Actions
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Toast actions
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Generate unique ID for toasts
const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isLoading: false,
  loadingMessage: null,
  error: null,
  toasts: [],

  // Loading actions
  setLoading: (loading, message) =>
    set({
      isLoading: loading,
      loadingMessage: loading ? message || null : null,
    }),

  // Error actions
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Toast actions
  showToast: (message, type = 'info', duration = 3000) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      }, duration);
    }
  },

  hideToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearAllToasts: () => set({ toasts: [] }),
}));

// Convenience selectors
export const selectIsLoading = (state: UIState) => state.isLoading;
export const selectLoadingMessage = (state: UIState) => state.loadingMessage;
export const selectError = (state: UIState) => state.error;
export const selectToasts = (state: UIState) => state.toasts;
