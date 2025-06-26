import * as z from 'zod/v4';

export const UserRegistrationSchema = z.object({
  email: z.email(),
  password: z.string(),
  lastname: z.string(),
  firstname: z.string(),
});

export const UserLoginSchema = z.object({
  email: z.email(),
  password: z.string(),
});
