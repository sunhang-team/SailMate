export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface ApiError {
  success: false;
  data: null;
  message: string;
  errorCode: string;
}
