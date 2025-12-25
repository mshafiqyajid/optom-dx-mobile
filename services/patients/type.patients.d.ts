// Patient Types

import type { PaginatedData } from '../types.common';

export interface Patient {
  id: number;
  type: 1 | 2; // 1 = Adult, 2 = Child
  full_name: string;
  nric: string;
  contact_number: string | null;
  email: string | null;
  address: string | null;
  dob: string | null;
  age: number | null;
  gender: 'male' | 'female' | null;
  class: string | null;
  school_name: string | null;
  parent_full_name: string | null;
  parent_relationship: string | null;
  parent_contact_number: string | null;
  parent_email: string | null;
  parent_address: string | null;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface GetPatientsResponse {
  success: boolean;
  data: PaginatedData<Patient>;
  message: string;
}

export interface PatientExistsResponse {
  success: boolean;
  data: Patient | null;
  message: string;
}

// Request Types
export interface GetPatientsParams {
  type?: 1 | 2;
  full_name?: string;
  page?: number;
  per_page?: number;
}

export interface CheckPatientExistsParams {
  nric: string;
}
