import { Prisma } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

export class BadRequestException extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

export class DuplicateException extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
    Object.setPrototypeOf(this, DuplicateException.prototype);
  }
}

export class NotFoundException extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class UnauthorizedException extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

export class ForbiddenException extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 403;
    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}

enum PrismaErrorCode {
  "P2002" = 409,
  "P2025" = 404,
}

export function ErrorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).send(err.message);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    res
      .status(PrismaErrorCode[err.code as keyof typeof PrismaErrorCode])
      .send(err.message);
  } else {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send(err.message);
  }
}
