export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

