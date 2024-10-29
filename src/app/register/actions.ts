'use server'

import { z } from 'zod'
import { formSchema } from '@/lib/validation/register'

export const registerAction = async ({
  email,
  password,
  passwordConfirm,
}: z.infer<typeof formSchema>) => {
  const validation = formSchema.safeParse({ email, password, passwordConfirm })

  if (!validation.success) {
    return {
      error: true,
      message:
        validation.error.issues[0].message ?? 'Registration error occurred',
    }
  }
}
