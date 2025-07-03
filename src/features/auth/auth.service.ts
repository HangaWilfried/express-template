import argon from 'argon2';
import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '@utils/orm';
import { AppError } from '@errors/AppError';
import { generateJWT } from '@middlewares/auth.middleware';
import { asyncHandler } from '@middlewares/handler.middleware';
import { generateRefreshToken, hashToken, setRefreshTokenCookie } from '@utils/token';

// Helper function to create and set a refresh token
const createAndSetRefreshToken = async (user: User, req: Request, res: Response) => {
  const refreshToken = generateRefreshToken();
  const hashedRefreshToken = await hashToken(refreshToken);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      userId: user.id,
      expiresAt,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    },
  });

  setRefreshTokenCookie(res, refreshToken);

  return generateJWT(user);
};

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const userCredential = req.body;
  const user = await prisma.user.findUnique({
    where: { email: userCredential.email },
  });
  if (!user) {
    throw new AppError('email or password are incorrect', 404);
  }
  const isPasswordOk = await argon.verify(user.password, userCredential.password);
  if (!isPasswordOk) {
    throw new AppError('email or password are incorrect', 404);
  }
  const accessToken = await createAndSetRefreshToken(user, req, res);

  res.status(201).json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    },
  });
});

export const register = asyncHandler(async(req: Request, res: Response, next: NextFunction)=> {
  const newUser = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email: newUser.email },
  });
  if (existingUser) {
    throw new AppError('User already exists', 409);
  }
  const password = await argon.hash(newUser.password);
  const user = await prisma.user.create({ data: { ...newUser, password } });

  const accessToken = await createAndSetRefreshToken(user, req, res);

  res.status(201).json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError('Refresh token not found', 401);
  }

  const incomingHashedRefreshToken = await hashToken(refreshToken);

  const storedRefreshToken = await prisma.refreshToken.findFirst({
    where: {
      token: incomingHashedRefreshToken,
      revoked: false,
    },
  });

  if (!storedRefreshToken || storedRefreshToken.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // Revoke the old refresh token
  await prisma.refreshToken.update({
    where: { id: storedRefreshToken.id },
    data: { revoked: true },
  });

  const user = await prisma.user.findUnique({ where: { id: storedRefreshToken.userId } });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const newAccessToken = await generateJWT(user);
  const newRefreshToken = generateRefreshToken();
  const hashedNewRefreshToken = await hashToken(newRefreshToken);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      token: hashedNewRefreshToken,
      userId: user.id,
      expiresAt,
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    },
  });

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({ accessToken: newAccessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const hashedRefreshToken = await hashToken(refreshToken);
    await prisma.refreshToken.updateMany({
      where: {
        token: hashedRefreshToken,
        revoked: false,
      },
      data: { revoked: true },
    });
  }

  res.clearCookie('refreshToken');
  res.status(204).end();
});
