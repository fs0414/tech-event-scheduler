import { prisma } from '@/lib/prisma';
import { cache } from 'react';

// ユーザーをメールアドレスで検索
export const findUserByEmail = cache(async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim()
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return user;
});

// ユーザーをIDで取得
export const findUserById = cache(async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return user;
});

// 複数のユーザーをIDで一括取得
export const findMultipleUsersById = cache(async (ids: string[]) => {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: ids
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true
    }
  });
  
  return users;
});

// ユーザー統計情報を取得
export const getUserStats = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      _count: {
        select: {
          ownerEvents: true,
          speakers: true
        }
      }
    }
  });
  return user;
});

// イベントのオーナー一覧を取得
export const getEventOwners = cache(async (eventId: number) => {
  const owners = await prisma.owner
    .findMany({
      where: {
        eventId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        }
      }
    })
    .then(results => results.sort((a, b) => {
      // organizer が先に来る
      if (a.role === 'organizer' && b.role !== 'organizer') return -1;
      if (b.role === 'organizer' && a.role !== 'organizer') return 1;
      return a.id - b.id;
    }));
  
  return owners;
});

// ユーザー検索（部分一致、除外ユーザーあり）
export const searchUsers = cache(async (query: string, excludeUserIds: string[] = [], limit: number = 10) => {
  if (!query.trim()) {
    return [];
  }
  
  const users = await prisma.user
    .findMany({
      where: {
        AND: [
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive'
                }
              },
              {
                email: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            ]
          },
          excludeUserIds.length > 0 ? {
            id: {
              notIn: excludeUserIds
            }
          } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      },
      take: limit
    })
    .then(results => results.sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      if (nameA !== nameB) return nameA.localeCompare(nameB);
      return a.email.localeCompare(b.email);
    }));
  
  return users;
});

// ユーザーのイベント参加履歴を取得
export const getUserEventHistory = cache(async (userId: string, limit: number = 10) => {
  const history = await prisma.owner
    .findMany({
      where: {
        userId
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            attendance: true,
            createdAt: true,
            eventUrl: true
          }
        }
      },
      take: limit
    })
    .then(results => results.sort((a, b) => b.id - a.id));
  
  return history;
});

export function invalidateUserCache(userId?: string, email?: string) {
  const tags = ['users', 'search:users'];
  
  if (userId) {
    tags.push(`user:id:${userId}`, `user:stats:${userId}`, `user:history:${userId}`);
  }
  
  if (email) {
    tags.push(`user:email:${email.toLowerCase()}`);
  }
  
  return tags;
}
