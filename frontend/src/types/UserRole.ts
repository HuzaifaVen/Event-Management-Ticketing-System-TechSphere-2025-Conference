// src/types/userRole.ts
export const UserRole = {
  ORGANIZER: "organizer",
  ATTENDEE: "attendee",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
