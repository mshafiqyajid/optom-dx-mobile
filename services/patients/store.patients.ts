import { useQuery } from '@tanstack/react-query';
import PatientAPI from './api.patients';
import type { GetPatientsParams, CheckPatientExistsParams } from './type.patients';

// Query Keys
export const patientKeys = {
  all: ['patients'] as const,
  lists: () => [...patientKeys.all, 'list'] as const,
  list: (params?: GetPatientsParams) => [...patientKeys.lists(), params] as const,
  exists: (nric: string) => [...patientKeys.all, 'exists', nric] as const,
};

/**
 * Hook to get all patients with optional filters
 */
export const useGetPatients = (params?: GetPatientsParams) => {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => PatientAPI.getPatients(params),
  });
};

/**
 * Hook to check if patient exists by NRIC
 */
export const useCheckPatientExists = (params: CheckPatientExistsParams, enabled = true) => {
  return useQuery({
    queryKey: patientKeys.exists(params.nric),
    queryFn: () => PatientAPI.checkPatientExists(params),
    enabled: enabled && !!params.nric,
  });
};
