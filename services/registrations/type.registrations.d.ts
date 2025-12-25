// Registration Types

import type { Patient } from '../patients/type.patients';
import type { Event } from '../events/type.events';
import type { PaginatedData } from '../types.common';

export interface Registration {
  id: number;
  patient_id: number;
  event_id: number;
  reference_number: string;
  attendance_status: RegistrationAttendanceStatus;
  description: RegistrationDescription | null;
  created_at: string;
  updated_at: string;
  // Relationships
  patient?: Patient;
  event?: Event;
}

export type RegistrationAttendanceStatus =
  | 'registered'
  | 'pass'
  | 'absent'
  | 'referred_optometrist'
  | 'referred_specialist';

export interface RegistrationDescription {
  consent: 'yes' | 'no';
  consent_statement?: 'yes' | 'no';
  question_1?: 'yes' | 'no';
  question_2?: 'yes' | 'no';
  question_3?: 'yes' | 'no';
  question_4?: 'yes' | 'no';
  question_5?: 'yes' | 'no';
  question_6?: 'yes' | 'no';
}

// Checkpoint Types
export interface RegistrationCheckpoint {
  id: number;
  registration_id: number;
  checkpoint: RegistrationCheckpointType;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type RegistrationCheckpointType =
  | 'profile_verification'
  | 'history_taking'
  | 'preliminary_test'
  | 'visual_acuity_assessment'
  | 'external_eye_examination'
  | 'refraction_assessment'
  | 'case_submission';

export interface CheckpointSummary {
  total: number;
  completed: number;
  pending: number;
}

// API Response Types
export interface GetRegistrationsResponse {
  success: boolean;
  data: PaginatedData<Registration>;
  message: string;
}

export interface CreateRegistrationResponse {
  success: boolean;
  data: Registration;
  message: string;
}

export interface GetCheckpointsResponse {
  success: boolean;
  data: {
    registration_id: number;
    reference_number: string;
    attendance_status: RegistrationAttendanceStatus;
    checkpoints: RegistrationCheckpoint[];
    summary: CheckpointSummary;
  };
  message: string;
}

export interface GetCheckpointResponse {
  success: boolean;
  data: RegistrationCheckpoint;
  message: string;
}

// Request Types
export interface GetRegistrationsParams {
  patient_id?: number;
  event_id?: number;
  page?: number;
  per_page?: number;
}

// Base registration request fields
interface BaseRegistrationRequest {
  event_id: number;
  type: 1 | 2;
  full_name: string;
  nric: string;
  description: RegistrationDescription;
}

// Type 1 (Adult) registration
interface AdultRegistrationRequest extends BaseRegistrationRequest {
  type: 1;
  contact_number: string;
  email: string;
  address: string;
}

// Type 2 (Child) registration
interface ChildRegistrationRequest extends BaseRegistrationRequest {
  type: 2;
  dob: string;
  age: number;
  gender: 'male' | 'female';
  class: string;
  school_name: string;
  parent_full_name: string;
  parent_relationship: string;
  parent_contact_number: string;
  parent_email: string;
  parent_address: string;
}

export type CreateRegistrationRequest = AdultRegistrationRequest | ChildRegistrationRequest;
