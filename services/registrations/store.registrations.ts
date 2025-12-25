import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RegistrationAPI from './api.registrations';
import type {
  GetRegistrationsParams,
  CreateRegistrationRequest,
  RegistrationCheckpointType,
} from './type.registrations';

// Query Keys
export const registrationKeys = {
  all: ['registrations'] as const,
  lists: () => [...registrationKeys.all, 'list'] as const,
  list: (params?: GetRegistrationsParams) => [...registrationKeys.lists(), params] as const,
  checkpoints: (registrationId: number) =>
    [...registrationKeys.all, 'checkpoints', registrationId] as const,
  checkpoint: (registrationId: number, checkpoint: RegistrationCheckpointType) =>
    [...registrationKeys.checkpoints(registrationId), checkpoint] as const,
};

/**
 * Hook to get all registrations with optional filters
 */
export const useGetRegistrations = (params?: GetRegistrationsParams) => {
  return useQuery({
    queryKey: registrationKeys.list(params),
    queryFn: () => RegistrationAPI.getRegistrations(params),
  });
};

/**
 * Hook to create a new registration
 */
export const useCreateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegistrationRequest) => RegistrationAPI.createRegistration(data),
    onSuccess: () => {
      // Invalidate registration lists
      queryClient.invalidateQueries({ queryKey: registrationKeys.lists() });
    },
  });
};

/**
 * Hook to get all checkpoints for a registration
 */
export const useGetCheckpoints = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: registrationKeys.checkpoints(registrationId),
    queryFn: () => RegistrationAPI.getCheckpoints(registrationId),
    enabled: enabled && !!registrationId,
  });
};

/**
 * Hook to get a specific checkpoint for a registration
 */
export const useGetCheckpoint = (
  registrationId: number,
  checkpoint: RegistrationCheckpointType,
  enabled = true
) => {
  return useQuery({
    queryKey: registrationKeys.checkpoint(registrationId, checkpoint),
    queryFn: () => RegistrationAPI.getCheckpoint(registrationId, checkpoint),
    enabled: enabled && !!registrationId && !!checkpoint,
  });
};
