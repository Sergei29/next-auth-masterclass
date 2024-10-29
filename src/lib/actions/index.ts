'use server'

import { z } from 'zod'
import { hash } from 'bcryptjs'
import { NeonDbError } from '@neondatabase/serverless'

import { formSchema } from '@/lib/validation/register'
import { users } from '@/lib/db/schema'
import { db } from '@/lib/db'

/**
 * @description error codes here below:
 * @link https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
const pgError = {
  '23505': 'User email must be unique',
} as Record<string, string>

const getErrorMessage = (err: unknown) => {
  let message =
    err instanceof Error
      ? err.message
      : (err as Record<string, unknown>).toString()

  if (err instanceof NeonDbError && err.code) {
    const code = err.code
    message = pgError[code] || err.detail || 'Registration error occurred'
  }

  return message
}

export const registerAction = async (
  formValues: z.infer<typeof formSchema>,
) => {
  try {
    const validation = formSchema.safeParse(formValues)

    if (!validation.success) {
      throw new Error(
        validation.error.issues[0].message ?? 'Registration error occurred',
      )
    }

    const hashedPassword = await hash(validation.data.password, 10)
    await db.insert(users).values({
      email: validation.data.email,
      password: hashedPassword,
    })
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err),
    }
  }
}
