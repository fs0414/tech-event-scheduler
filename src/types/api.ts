export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UpdateAttendanceResponse {
  success: boolean;
  newAttendance?: number;
}

// セキュリティ: 公開可能な情報のみを含むレスポンス型
export interface SearchUserResponse {
  id: string;
  name: string;
  email: string;
  // セキュリティ: supabaseId, 作成日時等の機密情報は除外
}

export interface OwnerActionResponse {
  success: boolean;
}