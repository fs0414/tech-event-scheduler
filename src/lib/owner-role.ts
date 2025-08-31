export const OWNER_ROLES = {
  ADMIN: 10,
  MEMBER: 20,
} as const;

export type OwnerRoleLevel = (typeof OWNER_ROLES)[keyof typeof OWNER_ROLES];

export const OWNER_ROLE_LABELS = {
  [OWNER_ROLES.ADMIN]: "管理者",
  [OWNER_ROLES.MEMBER]: "メンバー",
} as const;

export const LEGACY_ROLE_MAPPING = {
  organizer: OWNER_ROLES.ADMIN,
  participant: OWNER_ROLES.MEMBER,
  member: OWNER_ROLES.MEMBER,
} as const;
