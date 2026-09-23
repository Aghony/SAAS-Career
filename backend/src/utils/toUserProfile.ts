import type { User } from "@prisma/client";

export function toUserProfile(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, refreshTokenHash, ...profile } = user;
  return profile;
}
