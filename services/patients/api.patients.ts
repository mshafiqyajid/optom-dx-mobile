import api from '../api';
import type {
  GetPatientsResponse,
  GetPatientsParams,
  PatientExistsResponse,
  CheckPatientExistsParams,
} from './type.patients';

const PatientAPI = {
  /**
   * Get all patients with optional filters
   * Note: This is a PUBLIC endpoint (no auth required)
   */
  async getPatients(params?: GetPatientsParams): Promise<GetPatientsResponse> {
    const response = await api.get('/patients', { params });
    return response.data;
  },

  /**
   * Check if patient exists by NRIC
   * Note: This is a PUBLIC endpoint (no auth required)
   */
  async checkPatientExists(params: CheckPatientExistsParams): Promise<PatientExistsResponse> {
    const response = await api.get('/patients/patient-exists', { params });
    return response.data;
  },
};

export default PatientAPI;
