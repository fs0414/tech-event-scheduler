export * from './events';
export * from './users';

export const CACHE_TAGS = {
  EVENTS: 'events',
  USERS: 'users',
  TIMERS: 'timers',
  OWNERS: 'owners',
  SPEAKERS: 'speakers'
} as const;

export const CACHE_CONFIG = {
  SHORT: 30,    // 30秒
  MEDIUM: 60,   // 1分
  LONG: 300,    // 5分
  VERY_LONG: 600 // 10分
} as const;
