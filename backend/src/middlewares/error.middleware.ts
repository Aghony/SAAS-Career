import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import multer from "multer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ success: false, error: { code: err.code, message: err.message } });
  }
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "Ukuran file maksimal 5MB " : "Gagal mengunggah file";
    return res.status(400).json({ success: false, error: { code: "UPLOAD_ERROR", message } });
  }
  if (err instanceof Error && err.message === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_FILE_TYPE", message: "Hanya file PDF yang diperbolehkan" },
    });
  }
  console.error(err);
  return res.status(500).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan pada server" },
  });
}
