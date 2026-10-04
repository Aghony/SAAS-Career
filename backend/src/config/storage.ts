import path from "node:path";

export const UPLOAD_ROOT = path.resolve(process.cwd(), "uploads", "resumes");

export function resumeFileDir(userId: string) {
    return path.join(UPLOAD_ROOT, userId);
}
