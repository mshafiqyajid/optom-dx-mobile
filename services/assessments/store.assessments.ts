import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AssessmentAPI from './api.assessments';
import { registrationKeys } from '../registrations/store.registrations';
import type {
  HistoryTakingRequest,
  PreliminaryTestRequest,
  VisualAcuityAssessmentRequest,
  ExternalEyeExaminationRequest,
  UploadAttachmentRequest,
  RefractionAssessmentRequest,
  CaseSubmissionRequest,
} from './type.assessments';

// Query Keys
export const assessmentKeys = {
  all: ['assessments'] as const,
  historyTaking: (registrationId: number) =>
    [...assessmentKeys.all, 'history-taking', registrationId] as const,
  preliminaryTest: (registrationId: number) =>
    [...assessmentKeys.all, 'preliminary-test', registrationId] as const,
  visualAcuity: (registrationId: number) =>
    [...assessmentKeys.all, 'visual-acuity', registrationId] as const,
  externalEye: (registrationId: number) =>
    [...assessmentKeys.all, 'external-eye', registrationId] as const,
  refraction: (registrationId: number) =>
    [...assessmentKeys.all, 'refraction', registrationId] as const,
  caseSubmission: (registrationId: number) =>
    [...assessmentKeys.all, 'case-submission', registrationId] as const,
};

// ============================================
// History Taking Hooks
// ============================================
export const useGetHistoryTaking = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: assessmentKeys.historyTaking(registrationId),
    queryFn: () => AssessmentAPI.getHistoryTaking(registrationId),
    enabled: enabled && !!registrationId,
    retry: false, // Don't retry on 404
  });
};

export const useCreateOrUpdateHistoryTaking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HistoryTakingRequest) => AssessmentAPI.createOrUpdateHistoryTaking(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.historyTaking(variables.registration_id),
      });
      queryClient.invalidateQueries({
        queryKey: registrationKeys.checkpoints(variables.registration_id),
      });
    },
  });
};

// ============================================
// Preliminary Test Hooks
// ============================================
export const useGetPreliminaryTest = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: assessmentKeys.preliminaryTest(registrationId),
    queryFn: () => AssessmentAPI.getPreliminaryTest(registrationId),
    enabled: enabled && !!registrationId,
    retry: false,
  });
};

export const useCreateOrUpdatePreliminaryTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PreliminaryTestRequest) => AssessmentAPI.createOrUpdatePreliminaryTest(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.preliminaryTest(variables.registration_id),
      });
      queryClient.invalidateQueries({
        queryKey: registrationKeys.checkpoints(variables.registration_id),
      });
    },
  });
};

// ============================================
// Visual Acuity Assessment Hooks
// ============================================
export const useGetVisualAcuityAssessment = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: assessmentKeys.visualAcuity(registrationId),
    queryFn: () => AssessmentAPI.getVisualAcuityAssessment(registrationId),
    enabled: enabled && !!registrationId,
    retry: false,
  });
};

export const useCreateOrUpdateVisualAcuityAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VisualAcuityAssessmentRequest) =>
      AssessmentAPI.createOrUpdateVisualAcuityAssessment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.visualAcuity(variables.registration_id),
      });
      queryClient.invalidateQueries({
        queryKey: registrationKeys.checkpoints(variables.registration_id),
      });
    },
  });
};

// ============================================
// External Eye Examination Hooks
// ============================================
export const useGetExternalEyeExamination = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: assessmentKeys.externalEye(registrationId),
    queryFn: () => AssessmentAPI.getExternalEyeExamination(registrationId),
    enabled: enabled && !!registrationId,
    retry: false,
  });
};

export const useCreateOrUpdateExternalEyeExamination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ExternalEyeExaminationRequest) =>
      AssessmentAPI.createOrUpdateExternalEyeExamination(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.externalEye(variables.registration_id),
      });
      queryClient.invalidateQueries({
        queryKey: registrationKeys.checkpoints(variables.registration_id),
      });
    },
  });
};

export const useUploadExternalEyeAttachment = (registrationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadAttachmentRequest) =>
      AssessmentAPI.uploadExternalEyeAttachment(registrationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.externalEye(registrationId),
      });
    },
  });
};

// ============================================
// Refraction Assessment Hooks
// ============================================
export const useGetRefractionAssessment = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: assessmentKeys.refraction(registrationId),
    queryFn: () => AssessmentAPI.getRefractionAssessment(registrationId),
    enabled: enabled && !!registrationId,
    retry: false,
  });
};

export const useCreateOrUpdateRefractionAssessment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RefractionAssessmentRequest) =>
      AssessmentAPI.createOrUpdateRefractionAssessment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.refraction(variables.registration_id),
      });
      queryClient.invalidateQueries({
        queryKey: registrationKeys.checkpoints(variables.registration_id),
      });
    },
  });
};

// ============================================
// Case Submission Hooks
// ============================================
export const useGetCaseSubmission = (registrationId: number, enabled = true) => {
  return useQuery({
    queryKey: assessmentKeys.caseSubmission(registrationId),
    queryFn: () => AssessmentAPI.getCaseSubmission(registrationId),
    enabled: enabled && !!registrationId,
    retry: false,
  });
};

export const useCreateOrUpdateCaseSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CaseSubmissionRequest) => AssessmentAPI.createOrUpdateCaseSubmission(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.caseSubmission(variables.registration_id),
      });
      queryClient.invalidateQueries({
        queryKey: registrationKeys.checkpoints(variables.registration_id),
      });
    },
  });
};
