import type { Event, User, Owner, Speaker, Article, Timer } from '@prisma/client';

// Prismaのそのままの型を使用
export type EventWithDetails = Event & {
  owners: (Owner & {
    user: User;
  })[];
  speakers: (Speaker & {
    user: User;
    article: Article | null;
  })[];
  timers: Timer[];
};

export type EventWithOwners = Event & {
  owners: (Owner & {
    user: User;
  })[];
};

export interface EventDetailClientProps {
  event: EventWithDetails;
  currentUser?: User | null;
  auth?: import('@/types/auth').AuthContextType; // テスト時の依存性注入用
}

export interface EventCreateClientProps {
  currentUser: User;
  allUsers: Pick<User, 'id' | 'name' | 'email'>[];
}

export interface AttendanceCounterProps {
  currentAttendance: number;
  eventId: number;
  isOwner: boolean;
}

// イベント一覧用の軽量型
export type EventForList = Event & {
  owners: (Owner & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
  speakers?: (Speaker & {
    user: Pick<User, 'id' | 'name' | 'email'>;
    article: Article | null;
  })[];
  timers?: Timer[];
};