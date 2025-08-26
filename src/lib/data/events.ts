import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import type { EventForList, EventWithDetails } from '@/types/events';

export interface EventDetail extends EventWithDetails {}

// ユーザーのイベントを取得（検索付き）
export const getEventsForUser = cache(async (userId: string, search?: string) => {
  const events = await prisma.event.findMany({
    where: {
      AND: [
        search ? {
          title: { 
            contains: search, 
            mode: 'insensitive' 
          }
        } : {},
        {
          owners: {
            some: {
              userId: userId
            }
          }
        }
      ]
    },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return events;
});

// 特定のイベントの詳細を取得
export const getEventById = cache(async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    }
  });
  
  return event;
});

// イベント統計を取得
export const getEventStats = cache(async (userId: string) => {
  const [totalEvents, totalAttendance] = await Promise.all([
    prisma.event.count({
      where: {
        owners: {
          some: {
            userId: userId
          }
        }
      }
    }),
    prisma.event.aggregate({
      where: {
        owners: {
          some: {
            userId: userId
          }
        }
      },
      _sum: {
        attendance: true
      }
    })
  ]);

  return {
    totalEvents,
    totalAttendance: totalAttendance._sum.attendance || 0
  };
});

// ユーザー権限確認（イベントオーナーかチェック）
export const checkEventOwnership = cache(async (userId: string, eventId: number): Promise<boolean> => {
  const owner = await prisma.owner.findFirst({
    where: {
      eventId,
      userId
    }
  });
  
  return !!owner;
});

// イベントのタイマー一覧を取得
export const getEventTimers = cache(async (eventId: number) => {
  const timers = await prisma.timer.findMany({
    where: {
      eventId
    },
    orderBy: {
      sequence: 'asc'
    }
  });
  
  return timers;
});

// 複数のイベントデータを一括取得
export const getMultipleEventData = cache(async (eventIds: number[]) => {
  const events = await prisma.event.findMany({
    where: {
      id: {
        in: eventIds
      }
    },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return events;
});

// キャッシュ無効化ヘルパー（React cacheでは直接的な無効化は不要だが、互換性のため残す）
export function invalidateEventCache(eventId?: number, userId?: string) {
  const tags = ['events:list', 'events:detail'];
  
  if (eventId) {
    tags.push(`event:${eventId}`, `timers:event:${eventId}`);
  }
  
  if (userId) {
    tags.push(`events:user:${userId}`, `events:stats:${userId}`);
  }
  
  // React cacheは自動でリクエスト間でキャッシュされるため、手動無効化は不要
  return tags;
}