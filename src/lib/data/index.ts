// データフェッチ関数の統合エクスポート
export * from './events';
export * from './users';

// 共通のキャッシュタグ定数（React cacheでは自動管理されるが、互換性のため残す）
export const CACHE_TAGS = {
  EVENTS: 'events',
  USERS: 'users',
  TIMERS: 'timers',
  OWNERS: 'owners',
  SPEAKERS: 'speakers'
} as const;

// キャッシュ設定定数（React cacheでは不要だが、互換性のため残す）
export const CACHE_CONFIG = {
  SHORT: 30,    // 30秒
  MEDIUM: 60,   // 1分
  LONG: 300,    // 5分
  VERY_LONG: 600 // 10分
} as const;