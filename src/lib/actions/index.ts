'use server'

import { z } from 'zod'
import { compare, hash } from 'bcryptjs'
import { NeonDbError } from '@neondatabase/serverless'
import { redirect } from 'next/navigation'
import { eq } from 'drizzle-orm'

import type { AuthError } from 'next-auth'

import { formSchema as formSchemaChangePw } from '@/lib/validation/changePassword'
import { formSchema as formSchemaResetPw } from '@/lib/validation/resetPassword'
import {
  formSchema as formSchemaRegister,
  passwordMatchSchema,
} from '@/lib/validation/register'
import { formSchema as formSchemaLogin } from '@/lib/validation/login'
import { users, passwordResetTokens } from '@/lib/db/schema'
import { getValidToken } from '@/lib/getValidToken'
import { signIn, signOut, auth } from '@/auth'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

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

export const passwordResetAction = async (
  formValues: z.infer<typeof formSchemaResetPw>,
) => {
  try {
    const session = await auth()
    if (session) {
      throw new Error('User already logged in')
    }

    const validation = formSchemaResetPw.safeParse(formValues)
    if (!validation.success) {
      throw new Error(
        validation.error.issues[0].message ?? 'Reset password error occurred',
      )
    }

    /**
     * @description because we only need to see
     * if this user exists in the users table.
     * So we just select the ID from the users table,
     * where the email address matches the email address.
     */
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, validation.data.email as string))
    if (!user) {
      /**
       * @description We just let the user know that if they do have an account
       *  with us, that they would have been sent a password reset email at
       *  that particular email address. This is important because if
       *  a bad actor tried to reset the password of an account that doesn't
       *  belong to them, then they're not going to know if a user actually
       *  exists in our database. Instead of throw error we just return;
       */
      return
    }

    // generate pw reset token hash
    const passwordResetToken = randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour in ms

    /**
     * @description save it in passwordResetTokens table.
     * `onConflictDoUpdate()` - in case if the user has already
     *  requested a password reset token; ideally whenever they request another
     *  password reset token, we won't create a new row belonging to this user
     *  in our database, but overwrite the existing record in our table.
     *
     *  Now in the schema `src/lib/db/schema/passwordResetTokensSchema.ts` that
     *  we've added a unique constraint for our user ID, if we try and add a
     *  second password reset token for this user ID - an error will be thrown.
     *  However, instead of throwing an error, we can perform an update action
     *  on the matched row in the passwordResetTokens table
     *  for this user ID (target ).
     *  we want to set I.e. update some fields if a record already exists
     *  with matching a user ID.
     *  @example
     *  onConflictDoUpdate({
     *    target: passwordResetTokens.userId,
     *    set: {
     *      token: passwordResetToken,
     *      tokenExpiry
     *    },
     *  })
     */
    await db
      .insert(passwordResetTokens)
      .values({
        userId: user.id,
        token: passwordResetToken,
        tokenExpiry,
      })
      .onConflictDoUpdate({
        target: passwordResetTokens.userId,
        set: {
          token: passwordResetToken,
          tokenExpiry,
        },
      })

    // TODO: send user email
    console.log(
      'email with token html button link: ',
      `http://localhost:3000/update-password?token=${passwordResetToken}`,
    )
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err),
    }
  }
}

export const passwordUpdateAction = async (
  token: string,
  formValues: z.infer<typeof passwordMatchSchema>,
) => {
  const validToken = await getValidToken(token)
  if (!validToken) {
    return redirect('/update-password?token=')
  }

  try {
    const session = await auth()
    if (session) {
      throw new Error(
        'User already logged in. Please log out to reset your password',
      )
    }

    const validation = passwordMatchSchema.safeParse(formValues)
    if (!validation.success) {
      throw new Error(
        validation.error.issues[0].message ?? 'Update password error occurred',
      )
    }

    // update user by userId pw hash in DB
    const newPasswordHash = await hash(validation.data.password, 10)
    await db
      .update(users)
      .set({
        password: newPasswordHash,
      })
      .where(eq(users.id, validToken.userId))

    // remove token entry
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, validToken.id))
  } catch (err) {
    return {
      error: true,
      message: getErrorMessage(err),
    }
  }
}
