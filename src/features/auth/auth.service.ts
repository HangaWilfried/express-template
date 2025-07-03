import argon from 'argon2';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '@utils/orm';
import { AppError } from '@errors/AppError';
import { generateJWT } from '@middlewares/auth.middleware';
import { asyncHandler } from '@middlewares/handler.middleware';

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
  const token = await generateJWT(user);
  res.status(201).json({
    accessToken: token,
    user: {
      id: user.id,
      email: user.email,
      lastname: user.lastname,
      firstname: user.firstname,
    },
  });
})

export const register = asyncHandler(async(req: Request, res: Response, next: NextFunction)=> {
  const newUser = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email: newUser.email },
  });
  if (existingUser) {
    throw new AppError('User already exists', 409);
  }
  const password = await argon.hash(newUser.password);
  await prisma.user.create({ data: { ...newUser, password } });
  res.status(204).end();
})
