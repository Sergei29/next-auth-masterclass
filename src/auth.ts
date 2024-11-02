import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { compare } from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
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

        /**
         * @description the value returned will be used within the JWT payload
         */
        return { id: user.id.toString(), email: user.email }
      },
    }),
  ],
})
