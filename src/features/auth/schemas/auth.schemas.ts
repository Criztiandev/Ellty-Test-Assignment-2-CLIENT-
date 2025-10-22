import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must be at most 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const passwordResetSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
});

export const passwordConfirmSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  new_password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type PasswordConfirmFormData = z.infer<typeof passwordConfirmSchema>;
