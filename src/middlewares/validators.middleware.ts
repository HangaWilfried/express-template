import type { ZodType } from 'zod/v4';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (result.success) {
    req.body = result.data;
    return next();
  }

  const message = result.error.issues.map((e) => e.message).join(' | ');
  res.status(400).json({ status: 'validation_error', message });
};
