import { eq } from 'drizzle-orm'

import type { PasswordResetToken } from '@/types'

import { passwordResetTokens } from '@/lib/db/schema'
import { db } from '@/lib/db'

export const getValidToken = async (
  tokenFromUrl?: string,
): Promise<PasswordResetToken | null> => {
  try {
    if (!tokenFromUrl) return null
    const [token] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, tokenFromUrl))

    if (!token) return null

    if (Date.now() >= token.tokenExpiry.getTime()) {
      return null
    }

    return token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null
  }
}
