export interface ApiError {
  code: ErrorCode;
  message: string;
  status?: number;
  details?: unknown;
}

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  PARSE_ERROR = 'PARSE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN',
}

// Result型（Either/Result pattern）
export type Result<T, E = ApiError> = { success: true; data: T } | { success: false; error: E };
