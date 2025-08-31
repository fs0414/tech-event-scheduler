export * from "./events";
export * from "./users";

export const CACHE_TAGS = {
  EVENTS: "events",
  USERS: "users",
  TIMERS: "timers",
  OWNERS: "owners",
  SPEAKERS: "speakers",
} as const;

export const CACHE_CONFIG = {
  SHORT: 30,
  MEDIUM: 60,
  LONG: 300,
  VERY_LONG: 600,
} as const;
