import * as z from 'zod/v4';

export const UserAccountSchema = z.object({
  email: z.email(),
  lastname: z.string(),
  firstname: z.string(),
});
