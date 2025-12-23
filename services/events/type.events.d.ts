// Events Types based on Backend-Optom API
// Mirrored from optom-dx-fe/services/events/type.events.d.ts

import type { EventStatusType, EventCategoryType } from '../enums';
import type { PaginatedData } from '../types.common';

export interface EventStaff {
  id: number;
  full_name: string;
  email: string;
  pivot: {
    event_id: number;
    user_id: number;
    staff_role: string;
  };
}

export interface EventOrganizer {
  id: number;
  name: string;
  organizer_type: string;
  pic_name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  about: string | null;
  objectives: string | null;
  activities: string | null;
  category: EventCategoryType;
  status: EventStatusType;
  start_date: string;
  end_date: string;
  address_line_1: string | null;
  address_line_2: string | null;
  address_line_3: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  target_group: string | null;
  expected_number_of_participants: number | null;
  actual_number_of_participants: number | null;
  qr_code_url: string | null;
  qr_code_path: string | null;
  created_at: string;
  updated_at: string;
  organizer?: EventOrganizer;
  staff?: EventStaff[];
  operators?: EventStaff[];
  optometrists?: EventStaff[];
}

export interface EventListItem {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  about: string | null;
  category: EventCategoryType;
  status: EventStatusType;
  start_date: string;
  end_date: string;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  target_group: string | null;
  expected_number_of_participants: number | null;
  actual_number_of_participants: number | null;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
  organizer?: EventOrganizer;
}

export interface EventsListResponse {
  success: boolean;
  data: PaginatedData & {
    data: EventListItem[];
  };
  message: string;
}

export interface EventDetailResponse {
  success: boolean;
  data: Event;
  message: string;
}

export interface CreateEventRequest {
  organizer_id: number;
  title: string;
  description: string;
  about?: string;
  category: EventCategoryType;
  status?: EventStatusType;
  start_date: string;
  end_date: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  target_group?: string;
  expected_number_of_participants?: number;
  actual_number_of_participants?: number;
  staff_operators: number[];
  staff_optometrists: number[];
}

export interface CreateEventResponse {
  success: boolean;
  data: Event;
  message: string;
}

export interface UpdateEventRequest {
  organizer_id?: number;
  title?: string;
  description?: string;
  about?: string;
  category?: EventCategoryType;
  status?: EventStatusType;
  start_date?: string;
  end_date?: string;
  address_line_1?: string;
  address_line_2?: string;
  address_line_3?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  target_group?: string;
  expected_number_of_participants?: number;
  actual_number_of_participants?: number;
  staff_operators?: number[];
  staff_optometrists?: number[];
}

export interface UpdateEventResponse {
  success: boolean;
  data: Event;
  message: string;
}

export interface EventsQueryParams {
  page?: number;
  per_page?: number;
  category?: EventCategoryType;
  status?: EventStatusType;
  organizer_id?: number;
  start_date?: string;
  end_date?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface EventCheckInResponse {
  success: boolean;
  data: {
    event: Event;
    message: string;
  };
  message: string;
}

export interface DeleteEventResponse {
  success: boolean;
  message: string;
}
