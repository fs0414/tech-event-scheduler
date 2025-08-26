export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UpdateAttendanceResponse {
  success: boolean;
  newAttendance?: number;
}

export interface SearchUserResponse {
  id: string;
  name: string;
  email: string;
}

export interface OwnerActionResponse {
  success: boolean;
}
