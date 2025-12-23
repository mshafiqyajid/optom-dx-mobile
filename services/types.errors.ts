/**
 * API Error Types
 *
 * Structured error types for handling API responses
 */

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export interface NetworkError {
  message: string;
  isNetworkError: true;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
  status: 422;
}

// Type guard for API errors
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}

// Type guard for network errors
export function isNetworkError(error: unknown): error is NetworkError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isNetworkError' in error &&
    (error as NetworkError).isNetworkError === true
  );
}

// Type guard for validation errors
export function isValidationError(error: unknown): error is ValidationError {
  return isApiError(error) && error.status === 422 && 'errors' in error;
}

// Get user-friendly error message
export function getErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (isValidationError(error)) {
    const firstError = Object.values(error.errors)[0];
    return firstError?.[0] || error.message;
  }

  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

// Get all validation errors as a flat object
export function getValidationErrors(error: unknown): Record<string, string> {
  if (!isValidationError(error)) return {};

  return Object.entries(error.errors).reduce(
    (acc, [key, messages]) => {
      acc[key] = messages[0] || 'Invalid value';
      return acc;
    },
    {} as Record<string, string>
  );
}
