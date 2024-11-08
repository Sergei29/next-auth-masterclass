import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { authenticator } from 'otplib'
import { compare } from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
        otp: {},
      },

      async authorize(credentials) {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error('Invalid credentials.')
        }

        const isPasswordCorrect = await compare(
          credentials.password as string,
          user.password,
        )

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials.')
        }

        if (user.twoFactorActivated && typeof credentials.otp === 'string') {
          const isOtpValid = authenticator.check(
            credentials.otp,
            user.twoFactorSecret ?? '',
          )
          if (!isOtpValid) {
            throw new Error('OTP is not valid or expired')
          }
        }

        /**
         * @description the value returned will be used within the JWT payload
         */
        return { id: user.id.toString(), email: user.email }
      },
    }),
  ],
  /**
   * @description Makes a lot more sense that we actually store the ID as part
   * of the JWT token, which handles the user's logged in session.
   * Now there's 2 callbacks we need to add.
   */
  callbacks: {
    /**
     * @description The first is JWT. And this is going to manipulate our JWT token. So it's here where we're going to add the user ID to the JWT token.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    /**
     * @description And also we want to add a session callback. So again exactly the same thing. So we want to set the session user ID equal to the token ID.
     */
    session({ session, token }) {
      session.user.id = token.id as string
      return session
    },
  },
})
