import api from '../api';
import type {
  GetRegistrationsResponse,
  GetRegistrationsParams,
  CreateRegistrationRequest,
  CreateRegistrationResponse,
  GetCheckpointsResponse,
  GetCheckpointResponse,
  RegistrationCheckpointType,
} from './type.registrations';

const RegistrationAPI = {
  /**
   * Get all registrations with optional filters
   * Note: This is a PUBLIC endpoint (no auth required)
   */
  async getRegistrations(params?: GetRegistrationsParams): Promise<GetRegistrationsResponse> {
    const response = await api.get('/registrations', { params });
    return response.data;
  },

  /**
   * Create a new registration (and patient if not exists)
   * Note: This is a PUBLIC endpoint (no auth required)
   */
  async createRegistration(data: CreateRegistrationRequest): Promise<CreateRegistrationResponse> {
    const formData = new FormData();

    // Append all fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'description' && typeof value === 'object') {
        // Handle nested description object
        Object.entries(value as Record<string, string>).forEach(([descKey, descValue]) => {
          formData.append(`description[${descKey}]`, String(descValue));
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const response = await api.post('/registrations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get all checkpoints for a registration
   */
  async getCheckpoints(registrationId: number): Promise<GetCheckpointsResponse> {
    const response = await api.get(`/registrations/${registrationId}/checkpoints`);
    return response.data;
  },

  /**
   * Get a specific checkpoint for a registration
   */
  async getCheckpoint(
    registrationId: number,
    checkpoint: RegistrationCheckpointType
  ): Promise<GetCheckpointResponse> {
    const response = await api.get(`/registrations/${registrationId}/checkpoints/${checkpoint}`);
    return response.data;
  },
};

export default RegistrationAPI;
