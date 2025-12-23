// Shared Enums based on Backend-Optom API
// Mirrored from optom-dx-fe/services/enums.ts

// Event Status values
export const EventStatus = {
  DRAFT: 'Draft',
  UPCOMING: 'Upcoming',
  ONGOING: 'Ongoing',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type EventStatusType = typeof EventStatus[keyof typeof EventStatus];

export const EVENT_STATUS_OPTIONS = [
  { value: EventStatus.DRAFT, label: 'Draft' },
  { value: EventStatus.UPCOMING, label: 'Upcoming' },
  { value: EventStatus.ONGOING, label: 'Ongoing' },
  { value: EventStatus.COMPLETED, label: 'Completed' },
  { value: EventStatus.CANCELLED, label: 'Cancelled' },
] as const;

// Event Category values
export const EventCategory = {
  SCHOOL_SCREENING: 'School Screening',
  CORPORATE_SCREENING: 'Corporate Screening',
  COMMUNITY_SCREENING: 'Community Screening',
  OTHERS: 'Others',
} as const;

export type EventCategoryType = typeof EventCategory[keyof typeof EventCategory];

export const EVENT_CATEGORY_OPTIONS = [
  { value: EventCategory.SCHOOL_SCREENING, label: 'School Screening' },
  { value: EventCategory.CORPORATE_SCREENING, label: 'Corporate Screening' },
  { value: EventCategory.COMMUNITY_SCREENING, label: 'Community Screening' },
  { value: EventCategory.OTHERS, label: 'Others' },
] as const;

// Subscriber Type values
export const SubscriberType = {
  HOSPITAL: 'Hospital',
  CLINIC: 'Clinic',
  INDIVIDUAL: 'Individual',
} as const;

export type SubscriberTypeType = typeof SubscriberType[keyof typeof SubscriberType];

export const SUBSCRIBER_TYPE_OPTIONS = [
  { value: SubscriberType.HOSPITAL, label: 'Hospital' },
  { value: SubscriberType.CLINIC, label: 'Clinic' },
  { value: SubscriberType.INDIVIDUAL, label: 'Individual' },
] as const;

// Organizer Type values
export const OrganizerType = {
  PRIVATE: 'Private',
  GOVERNMENT: 'Government',
  NGO: 'NGO',
  CORPORATE: 'Corporate',
} as const;

export type OrganizerTypeType = typeof OrganizerType[keyof typeof OrganizerType];

export const ORGANIZER_TYPE_OPTIONS = [
  { value: OrganizerType.PRIVATE, label: 'Private' },
  { value: OrganizerType.GOVERNMENT, label: 'Government' },
  { value: OrganizerType.NGO, label: 'NGO' },
  { value: OrganizerType.CORPORATE, label: 'Corporate' },
] as const;

// User Roles
export const UserRole = {
  ADMIN: 'Admin',
  OPERATOR: 'Operator',
  OPTOMETRIST: 'Optometrist',
  SPECIALIST: 'Specialist',
  PATIENT: 'Patient',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export const USER_ROLE_OPTIONS = [
  { value: UserRole.ADMIN, label: 'Admin' },
  { value: UserRole.OPERATOR, label: 'Operator' },
  { value: UserRole.OPTOMETRIST, label: 'Optometrist' },
  { value: UserRole.SPECIALIST, label: 'Specialist' },
  { value: UserRole.PATIENT, label: 'Patient' },
] as const;

// Login Status
export const LoginStatus = {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type LoginStatusType = typeof LoginStatus[keyof typeof LoginStatus];
