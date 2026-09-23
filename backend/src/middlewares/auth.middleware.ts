import type { Request, Response, NextFunction } from "express";
import { tokenService } from "../services/token.service.js";
import { AppError } from "../utils/AppError.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "UNAUTHORIZED", "Token tidak ditemukan"));
  }
  try {
    const payload = tokenService.verifyAccessToken(header.slice(7));
    req.user = { id: payload.sub };
    next();
  } catch {
    next(new AppError(401, "UNAUTHORIZED", "Token tidak valid atau kedaluwarsa"));
  }
}
