import crypto from 'crypto';
import argon from 'argon2';
import { Response } from 'express';
import { config } from '../config';

export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashToken = async (token: string): Promise<string> => {
  return argon.hash(token);
};

export const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'lax', // CSRF protection
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
};
