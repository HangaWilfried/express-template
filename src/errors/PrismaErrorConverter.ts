import { Prisma } from '@prisma/client';
import { AppError } from './AppError';

export function handlePrismaError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
        return new AppError('Data not found in data base', 404);
      case 'P2002':
        return new AppError('Conflict : this data already used', 409);
      default:
        return new AppError('Error Prisma : ' + error.message, 400);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError('Error during validate prisma', 422);
  }

  return error;
}
