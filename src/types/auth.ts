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

export interface PublicUserInfo {
  id: string;
  name: string | null;
  email: string;
}

export type SafeUser = Omit<PrismaUser, 'supabaseId'>;
