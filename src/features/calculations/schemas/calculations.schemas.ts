import { z } from 'zod';

export const createStartingNumberSchema = z.object({
  number: z
    .number({
      message: 'Number must be a valid number',
    })
    .min(-1_000_000, { message: 'Number must be greater than or equal to -1,000,000' })
    .max(1_000_000, { message: 'Number must be less than or equal to 1,000,000' }),
});

export const addOperationSchema = z.object({
  number: z
    .number({
      message: 'Number must be a valid number',
    })
    .min(-1_000_000, { message: 'Number must be greater than or equal to -1,000,000' })
    .max(1_000_000, { message: 'Number must be less than or equal to 1,000,000' }),
});

export type CreateStartingNumberFormData = z.infer<typeof createStartingNumberSchema>;
export type AddOperationFormData = z.infer<typeof addOperationSchema>;
