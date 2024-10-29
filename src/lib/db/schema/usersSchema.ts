import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  email: text('email').unique(),
  password: text('password'),
  twoFactorSecret: text('2fa_secret'),
  twoFactorActivated: boolean('2fa_activated').default(false),
})
