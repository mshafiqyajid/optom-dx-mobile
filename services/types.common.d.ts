// Common Types used across services
// Mirrored from optom-dx-fe/services/types.common.d.ts

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
