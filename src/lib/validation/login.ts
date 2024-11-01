import { z } from 'zod'

import { passwordSchema } from './register'

export const formSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
})
