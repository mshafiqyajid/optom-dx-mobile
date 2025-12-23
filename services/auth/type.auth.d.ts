// Auth Types based on Backend-Optom API
// Mirrored from optom-dx-fe/services/auth/type.auth.d.ts

export interface User {
  id: number;
  name: string | null;
  email: string;
  nric: string | null;
  contact_number: string | null;
  address: string | null;
  state: string | null;
  postcode: string | null;
  city: string | null;
  subscriber_id: number | null;
  status: boolean;
  avatar: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirmation: string;
  full_name?: string;
  ic_number?: string;
  company_name?: string;
  company_registration_number?: string;
  is_company?: boolean;
  role?: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
  message: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  success: boolean;
  message: string;
}
