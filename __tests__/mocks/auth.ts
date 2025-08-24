import { User as SupabaseUser } from '@supabase/supabase-js';
import { User as PrismaUser } from '@prisma/client';
import { AuthContextType } from '@/types/auth';

export const mockSupabaseUser: SupabaseUser = {
  id: 'mock-supabase-id',
  email: 'test@gmail.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z'
};

export const mockPrismaUser: PrismaUser = {
  id: 'mock-user-id',
  supabaseId: 'mock-supabase-id',
  name: 'テストユーザー',
  email: 'test@gmail.com',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const createMockAuth = (overrides?: Partial<AuthContextType>): AuthContextType => ({
  supabaseUser: mockSupabaseUser,
  dbUser: mockPrismaUser,
  loading: false,
  isOwner: jest.fn().mockResolvedValue(true),
  ...overrides
});

// 非認証状態のモック
export const createUnauthenticatedMockAuth = (): AuthContextType => ({
  supabaseUser: null,
  dbUser: null,
  loading: false,
  isOwner: jest.fn().mockResolvedValue(false)
});

// 非オーナーユーザーのモック
export const createNonOwnerMockAuth = (): AuthContextType => ({
  supabaseUser: mockSupabaseUser,
  dbUser: mockPrismaUser,
  loading: false,
  isOwner: jest.fn().mockResolvedValue(false)
});

// ローディング状態のモック
export const createLoadingMockAuth = (): AuthContextType => ({
  supabaseUser: null,
  dbUser: null,
  loading: true,
  isOwner: jest.fn().mockResolvedValue(false)
});