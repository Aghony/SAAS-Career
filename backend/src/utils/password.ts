import argon2 from "argon2";

export const passwordUtil = {
  hash(plain: string) {
    return argon2.hash(plain, { type: argon2.argon2id });
  },
  verify(hash: string, plain: string) {
    return argon2.verify(hash, plain);
  },
};
