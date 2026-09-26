declare namespace Express {
  export interface Request {
    user?: { id: string };
    validatedQuery?: Record<string, unknown>;
  }
}
