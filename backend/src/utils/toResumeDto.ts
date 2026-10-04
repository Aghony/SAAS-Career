import type { Resume } from "@prisma/client";

export function toResumeDto(resume: Resume) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { filePath, userId, ...dto } = resume;
  return dto;
}
