import type { Request, Response, NextFunction } from 'express';

import { logger } from '@utils/logger';
import { AppError } from '@errors/AppError';
import { handlePrismaError } from '@errors/PrismaErrorConverter';

export function ErrorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  const customError = handlePrismaError(err);
  const status = customError instanceof AppError ? customError.statusCode : 500;
  const message = customError instanceof AppError ? customError.message : 'Unexpected server error';

  logger.error(customError);

  res.status(status).json({
    status: 'error',
    message,
  });
}
