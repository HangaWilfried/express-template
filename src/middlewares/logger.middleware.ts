import type { Request, Response, NextFunction } from "express";

export function LoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const now = new Date().toUTCString();
  const method = req.method;
  const url = req.url;

  console.log(`[${now}] ${method} ${url}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);

  next();
}
