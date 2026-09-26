import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/AppError.js";

export function validate(schema: ZodType, source: "body" | "query" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.issues.map((i) => i.message).join("; ");
      return next(new AppError(400, "VALIDATION_ERROR", message));
    }
    if (source === "body") {
      req.body = result.data;
    } else {
      req.validatedQuery = result.data as Record<string, unknown>;
    }
    next();
  };
}
