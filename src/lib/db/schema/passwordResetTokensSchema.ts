import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { users } from './usersSchema'

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .unique()
    .notNull(),
  token: text('token').notNull(),
  tokenExpiry: timestamp('token_expiry').notNull(),
})
