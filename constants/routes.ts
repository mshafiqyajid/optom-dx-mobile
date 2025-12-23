/**
 * Type-safe route constants for navigation
 * Use these instead of hardcoded route strings
 */

export const ROUTES = {
  // Auth
  LOGIN: '/(auth)/login' as const,

  // Tabs
  HOME: '/(tabs)' as const,
  PROFILE_TAB: '/(tabs)/profile' as const,

  // Event
  EVENT: (id: number) => `/event/${id}` as const,

  // Patient
  PATIENT_PROFILE: (id: number) => `/profile/${id}` as const,
  CHECKPOINT: (id: number) => `/checkpoint/${id}` as const,

  // Diagnostics
  HISTORY_TAKING: (id: number) => `/history-taking/${id}` as const,
  PRELIMINARY_TEST: (id: number) => `/preliminary-test/${id}` as const,
  VISUAL_ACUITY: (id: number) => `/visual-acuity/${id}` as const,
} as const;

// Type helper for route params
export type RouteParams = {
  event: { id: number };
  profile: { id: number };
  checkpoint: { id: number };
  'history-taking': { id: number };
  'preliminary-test': { id: number };
  'visual-acuity': { id: number };
};
