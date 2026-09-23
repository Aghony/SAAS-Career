import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, error: { code: err.code, message: err.message } });
  }
  console.error(err);
  return res
    .status(500)
    .json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan pada server" },
    });
}
