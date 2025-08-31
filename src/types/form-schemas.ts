// Zodスキーマから生成される型を一元管理

// Event関連の型
export type {
  CreateEventClientInput,
  CreateEventFormInput,
  CreateEventInput,
  UpdateAttendanceInput,
  UpdateEventInput,
  ValidationResult as EventValidationResult,
} from "@/lib/validations/event";
// Timer関連の型
export type {
  CreateTimerFormInput,
  CreateTimerInput,
  DeleteTimerInput,
  UpdateTimerInput,
  UpdateTimerSequenceInput,
  ValidationResult as TimerValidationResult,
} from "@/lib/validations/timer";
// User関連の型
export type {
  AddOwnerInput,
  ChangeOwnerRoleInput,
  RemoveOwnerInput,
  SearchUserInput,
  ValidationResult as UserValidationResult,
} from "@/lib/validations/user";

// 共通のAPI レスポンス型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// フォーム関連の共通型
export interface FormState<T = unknown> {
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  success?: boolean;
}
