/**
 * Mock Data Constants
 *
 * This file contains all mock data used throughout the app.
 * TODO: Replace with real API data when backend endpoints are available.
 */

import { CheckpointStep, CheckpointStepStatus } from './checkpoint';

// ============================================================================
// Patient Types & Data
// ============================================================================

export interface Patient {
  id: string;
  name: string;
  refNo: string;
  completed: boolean;
  registeredAt?: string;
}

export interface PatientDetails {
  name: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  classGrade: string;
  schoolName: string;
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '002',
    name: 'Nur Aisyah binti Rahman',
    refNo: 'SKTP-20250803-002',
    completed: true,
  },
  {
    id: '003',
    name: 'Lim Wei Xuan',
    refNo: 'SKTP-20250803-003',
    completed: false,
  },
  {
    id: '004',
    name: 'Faris Hakim bin Azman',
    refNo: 'SKTP-20250803-004',
    completed: true,
  },
  {
    id: '005',
    name: 'Arvind Raj a/l Kumar',
    refNo: 'SKTP-20250803-005',
    completed: true,
  },
  {
    id: '006',
    name: 'Siti Nur Syafiqah bt Zulkifli',
    refNo: 'SKTP-20250803-006',
    completed: false,
  },
];

export const MOCK_PATIENT_DETAILS: PatientDetails = {
  name: 'Nur Aisyah binti Rahman',
  dateOfBirth: '15/03/2018',
  age: '7 years old',
  gender: 'Female',
  classGrade: 'Standard 1 ( Class B)',
  schoolName: 'SK Taman Putra, Putrajaya',
};

// ============================================================================
// Checkpoint Steps
// ============================================================================

export const MOCK_CHECKPOINT_STEPS: CheckpointStep[] = [
  {
    id: 1,
    title: 'Profile Verification',
    status: CheckpointStepStatus.COMPLETED,
    completedAt: 'Aug 04, 2025 at 10.00 AM',
  },
  {
    id: 2,
    title: 'History Taking',
    status: CheckpointStepStatus.PENDING,
  },
  {
    id: 3,
    title: 'Preliminary Test',
    status: CheckpointStepStatus.PENDING,
  },
  {
    id: 4,
    title: 'Visual Acuity Assessment',
    status: CheckpointStepStatus.PENDING,
  },
  {
    id: 5,
    title: 'External Eye Examination',
    status: CheckpointStepStatus.PENDING,
  },
  {
    id: 6,
    title: 'Refraction Assessment',
    status: CheckpointStepStatus.PENDING,
  },
  {
    id: 7,
    title: 'Referral & Case Submission',
    status: CheckpointStepStatus.PENDING,
  },
];

// ============================================================================
// Helper function to get checkpoint steps (can be extended for dynamic data)
// ============================================================================

export const getMockCheckpointSteps = (): CheckpointStep[] => MOCK_CHECKPOINT_STEPS;
