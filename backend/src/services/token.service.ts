import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export const tokenService = {
  signAccessToken(userId: string) {
    return jwt.sign({ sub: userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  },
  signRefreshToken(userId: string) {
    return jwt.sign({ sub: userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  },
  verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as { sub: string };
  },
  verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as { sub: string };
  },
};
