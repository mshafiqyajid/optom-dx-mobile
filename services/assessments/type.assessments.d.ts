// Assessment Types

import type { Registration } from '../registrations/type.registrations';

// ============================================
// History Taking
// ============================================
export interface HistoryTaking {
  id: number;
  registration_id: number;
  section_a: Record<string, unknown>;
  section_b: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}

export interface HistoryTakingRequest {
  registration_id: number;
  section_a: Record<string, unknown>;
  section_b: Record<string, unknown>;
}

export interface HistoryTakingResponse {
  success: boolean;
  data: HistoryTaking;
  message: string;
}

// ============================================
// Preliminary Test
// ============================================
export interface PreliminaryTest {
  id: number;
  registration_id: number;
  section_a: Record<string, unknown>;
  section_b: Record<string, unknown>;
  section_c: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}

export interface PreliminaryTestRequest {
  registration_id: number;
  section_a: Record<string, unknown>;
  section_b: Record<string, unknown>;
  section_c: Record<string, unknown>;
}

export interface PreliminaryTestResponse {
  success: boolean;
  data: PreliminaryTest;
  message: string;
}

// ============================================
// Visual Acuity Assessment
// ============================================
export interface VisualAcuityAssessment {
  id: number;
  registration_id: number;
  description: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}

export interface VisualAcuityAssessmentRequest {
  registration_id: number;
  description: Record<string, unknown>;
}

export interface VisualAcuityAssessmentResponse {
  success: boolean;
  data: VisualAcuityAssessment;
  message: string;
}

// ============================================
// External Eye Examination
// ============================================
export interface ExternalEyeExamination {
  id: number;
  registration_id: number;
  anterior: Record<string, unknown>;
  anterior_left_filename: string | null;
  anterior_right_filename: string | null;
  fundus: Record<string, unknown>;
  fundus_left_filename: string | null;
  fundus_right_filename: string | null;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}

export interface ExternalEyeExaminationRequest {
  registration_id: number;
  anterior: Record<string, unknown>;
  fundus?: Record<string, unknown>; // Optional - operator_notes is now in anterior
}

export interface ExternalEyeExaminationResponse {
  success: boolean;
  data: ExternalEyeExamination;
  message: string;
}

export type AttachmentType = 'anterior_left' | 'anterior_right' | 'fundus_left' | 'fundus_right';

export interface UploadAttachmentRequest {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  type: AttachmentType;
}

export interface UploadAttachmentResponse {
  success: boolean;
  data: {
    filename: string;
    path: string;
    type: AttachmentType;
  };
  message: string;
}

// ============================================
// Refraction Assessment
// ============================================
export interface RefractionAssessment {
  id: number;
  registration_id: number;
  description: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}

export interface RefractionAssessmentRequest {
  registration_id: number;
  description: Record<string, unknown>;
}

export interface RefractionAssessmentResponse {
  success: boolean;
  data: RefractionAssessment;
  message: string;
}

// ============================================
// Case Submission
// ============================================
export interface CaseSubmission {
  id: number;
  registration_id: number;
  description: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  registration?: Registration;
}

export interface CaseSubmissionRequest {
  registration_id: number;
  description: Record<string, unknown>;
}

export interface CaseSubmissionResponse {
  success: boolean;
  data: CaseSubmission;
  message: string;
}

// ============================================
// Error Response
// ============================================
export interface AssessmentNotFoundResponse {
  success: false;
  message: string;
}
