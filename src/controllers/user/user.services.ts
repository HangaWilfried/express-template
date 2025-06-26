import argon from "argon2";
import { NextFunction, Request, Response } from "express";

import { prisma } from "../../utils/orm";
import { generateUUID } from "../../utils/methods";
import { DuplicateException, NotFoundException } from "../../utils/error";
import {
  createAccountTemplate,
  sendEmailNotification,
} from "./notification.services";

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
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
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.params.id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      id: user.id,
    });
  } catch (error) {
    next(error);
  }
}

export async function editUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const payload = req.body;
    const foundUser = await prisma.user.findUnique({
      where: { id: req.params.id },
    });
    if (!foundUser) {
      throw new NotFoundException("User not found");
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: payload,
    });
    res.status(200).send(user.id);
  } catch (error) {
    next(error);
  }
}

export async function deleteUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await prisma.user.findFirst({ where: { id: req.params.id } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const newUser = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email: newUser.email },
    });
    if (existingUser) {
      throw new DuplicateException("User already exists");
    }

    const password = generateUUID();
    const hash = await argon.hash(password);

    await sendEmailNotification({
      receiver: newUser.email,
      subject: "Your New Account",
      html: createAccountTemplate(newUser.email, password),
    });

    await prisma.user.create({ data: { ...newUser, password: hash } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function changeUserPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const email = (req.user as { email: string }).email;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const password = await argon.hash(req.body);
    await prisma.user.update({
      where: { id: user.id },
      data: { password },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
