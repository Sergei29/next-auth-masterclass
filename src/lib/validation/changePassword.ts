import { z } from 'zod'

import { passwordSchema, passwordMatchSchema } from './register'

export const formSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema)
