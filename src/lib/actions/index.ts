'use server'

import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import { NeonDbError } from '@neondatabase/serverless'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import type { AuthError } from 'next-auth'

import { formSchema as formSchemaChangePw } from '@/lib/validation/changePassword'
import { formSchema as formSchemaRegister } from '@/lib/validation/register'
import { formSchema as formSchemaLogin } from '@/lib/validation/login'
import { users } from '@/lib/db/schema'
import { signIn, signOut, auth } from '@/auth'
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

  if ((err as AuthError).cause) {
    message =
      (err as AuthError).cause?.err?.message || 'NextAuth error occurred'
  }

  return message
}

export const registerAction = async (
  formValues: z.infer<typeof formSchemaRegister>,
) => {
  try {
    const validation = formSchemaRegister.safeParse(formValues)

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

export const loginWithCredentialsAction = async (
  formValues: z.infer<typeof formSchemaLogin>,
) => {
  try {
    const validation = formSchemaLogin.safeParse(formValues)

    if (!validation.success) {
      throw new Error(
        validation.error.issues[0].message ?? 'Login error occurred',
      )
    }
    const { email, password } = validation.data
    await signIn('credentials', { email, password, redirect: false })
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err),
    }
  }
  redirect('/my-account')
}

export const logoutAction = async () => {
  await signOut()
}

export const changePasswordAction = async (
  formValues: z.infer<typeof formSchemaChangePw>,
) => {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('Unauthenticated')
    }
    const validation = formSchemaChangePw.safeParse(formValues)

    if (!validation.success) {
      throw new Error(
        validation.error.issues[0].message ?? 'Change password error occurred',
      )
    }
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user?.email as string))
    if (!user) {
      throw new Error('User not found.')
    }

    const isPasswordCorrect = await compare(
      validation.data.currentPassword as string,
      user.password,
    )

    if (!isPasswordCorrect) {
      throw new Error('Unauthorized.')
    }

    const newPasswordHash = await hash(validation.data.password, 10)
    await db
      .update(users)
      .set({
        password: newPasswordHash,
      })
      .where(eq(users.email, session.user?.email as string))
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err),
    }
  }
}
