import { z } from 'zod'

export const passwordSchema = z
  .string()
  .min(5, 'Password must contain at least 5 characters')

export const passwordMatchSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .superRefine(({ password, passwordConfirm }, context) => {
    if (password !== passwordConfirm) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passwordConfirm'],
        message: 'passwords do not match',
      })
    }
  })

export const formSchema = z
  .object({
    email: z.string().email(),
  })
  .and(passwordMatchSchema)
