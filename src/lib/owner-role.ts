// オーナー権限レベル定義
export const OWNER_ROLES = {
  ADMIN: 10,     // 管理者（最高権限）
  MEMBER: 20,    // メンバー（一般権限）
} as const;

// 権限レベルの型
export type OwnerRoleLevel = typeof OWNER_ROLES[keyof typeof OWNER_ROLES];

// 権限レベルから表示名への変換
export const OWNER_ROLE_LABELS = {
  [OWNER_ROLES.ADMIN]: '管理者',
  [OWNER_ROLES.MEMBER]: 'メンバー',
} as const;

// 旧文字列roleからint roleへの変換マッピング
export const LEGACY_ROLE_MAPPING = {
  'organizer': OWNER_ROLES.ADMIN,
  'participant': OWNER_ROLES.MEMBER,
  'member': OWNER_ROLES.MEMBER,
} as const;