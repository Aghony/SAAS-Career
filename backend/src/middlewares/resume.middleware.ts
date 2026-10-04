import multer from "multer";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { Request } from "express";
import { resumeFileDir } from "../config/storage.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination(req: Request, _file, callback) {
    const dir = resumeFileDir(req.user!.id);
    fs.mkdirSync(dir, { recursive: true });
    callback(null, dir);
  },
  filename(_req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${ext}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) {
  if (file.mimetype !== "application/pdf") {
    return callback(new Error("INVALID_FILE_TYPE"));
  }
  callback(null, true);
}

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single("file");
