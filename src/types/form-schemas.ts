// Zodスキーマから生成される型を一元管理

// Event関連の型
export type {
  CreateEventInput,
  UpdateEventInput,
  UpdateAttendanceInput,
  CreateEventFormInput,
  CreateEventClientInput,
  ValidationResult as EventValidationResult
} from '@/lib/validations/event';

// User関連の型
export type {
  SearchUserInput,
  AddOwnerInput,
  ChangeOwnerRoleInput,
  RemoveOwnerInput,
  ValidationResult as UserValidationResult
} from '@/lib/validations/user';

// Timer関連の型
export type {
  CreateTimerInput,
  UpdateTimerInput,
  DeleteTimerInput,
  UpdateTimerSequenceInput,
  CreateTimerFormInput,
  ValidationResult as TimerValidationResult
} from '@/lib/validations/timer';

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