import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.js";
import { toUserProfile } from "../utils/toUserProfile.js";

const COOKIE_NAME = "refreshToken";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await authService.register(req.body);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, { user: toUserProfile(user), accessToken }, 201);
  },

  async login(req: Request, res: Response) {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, { user: toUserProfile(user), accessToken });
  },

  async refresh(req: Request, res: Response) {
        const { user, accessToken, refreshToken } = await authService.refresh(req.cookies[COOKIE_NAME]);
    res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
    sendSuccess(res, { user: toUserProfile(user), accessToken });
  },

  async logout(req: Request, res: Response) {
    await authService.logout(req.user!.id);
    res.clearCookie(COOKIE_NAME, { path: "/api/auth" });
    sendSuccess(res, { message: "Logged out" });
  },

  async me(req: Request, res: Response) {
    const user = await authService.getProfile(req.user!.id);
    sendSuccess(res, { user: toUserProfile(user) });
  },
};
