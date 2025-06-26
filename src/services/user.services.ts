import argon from 'argon2';
import { NextFunction, Request, Response } from 'express';

import { prisma } from '@utils/orm';
import { AppError } from '@errors/AppError';
import { asyncHandler } from '@middlewares/handler.middleware';

export const getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const users = await prisma.user.findMany();
  res.status(200).json(
    users.map((user) => {
      return {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        id: user.id,
        isAdmin: user.isAdmin,
      };
    }),
  );
});

export const getUserById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const user = await prisma.user.findFirst({ where: { id: req.params.id } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    id: user.id,
  });
});

export const editUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const foundUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!foundUser) {
      throw new AppError('User not found', 404);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: payload,
    });
    res.status(200).send(user.id);
  },
);

export const deleteUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findFirst({ where: { id: req.params.id } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  },
);

export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = (req.user as { email: string }).email;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const password = await argon.hash(req.body);
    await prisma.user.update({
      where: { id: user.id },
      data: { password },
    });

    res.status(204).end();
  },
);
