import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { prisma } from "./orm";
import { SECRET } from "./secret";

export const STRATEGY = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET,
  },
  (jwt_payload, done) => {
    const user = prisma.user.findFirst({
      where: { id: jwt_payload.id },
    });
    if (user) return done(null, user);
    return done(null, false);
  },
);

export const generateJWT = async (user: User): Promise<string> => {
  const payload = {
    id: user.id,
    email: user.email,
    lastname: user.lastname,
    firstname: user.firstname,
    isAdmin: user.isAdmin,
  };
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
};

export const extractTokenInfo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token invalid or not provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (error) {
    console.error("Error during token validation:", error);
    return res.status(403).json({ message: "Token invalid or expired." });
  }
};
