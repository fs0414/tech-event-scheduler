import { User as SupabaseUser } from "@supabase/supabase-js";
import { User as PrismaUser } from "@prisma/client";

export interface AuthContextType {
  supabaseUser: SupabaseUser | null;
  dbUser: PrismaUser | null;
  loading: boolean;
  isOwner: (eventId: number) => Promise<boolean>;
}

export interface AuthenticatedUser {
  supabaseUser: SupabaseUser;
  dbUser: PrismaUser;
}

// セキュリティ: 公開可能なユーザー情報のみを含む型
export interface PublicUserInfo {
  id: string;
  name: string | null;
  email: string;
}

// セキュリティ: 機密情報を除外したユーザー型
export type SafeUser = Omit<PrismaUser, 'supabaseId'>;