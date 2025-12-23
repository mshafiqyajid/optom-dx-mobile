import api from '../api';
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationRequest,
  ResendVerificationResponse,
} from './type.auth';

const authAPIs = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    return api.post(`/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    }).then((response) => response.data);
  },

  async logout(): Promise<LogoutResponse> {
    return api.post(`/logout`).then((response) => response.data);
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    return api.post(`/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      }
    }).then((response) => response.data);
  },

  async resendVerification(data: ResendVerificationRequest): Promise<ResendVerificationResponse> {
    const formData = new FormData();
    formData.append('email', data.email);

    return api.post(`/resend-verification`, formData, {
      headers: {
        'Accept': 'application/json',
      }
    }).then((response) => response.data);
  },
};

export default authAPIs;
