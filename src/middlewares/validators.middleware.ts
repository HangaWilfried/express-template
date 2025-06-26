import { ZodType } from 'zod/v4';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues.map((e) => e.message).join(' | ');
    return res.status(400).json({ status: 'validation_error', message });
  }
  next();
};
