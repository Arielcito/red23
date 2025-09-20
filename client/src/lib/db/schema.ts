import { pgTable, bigserial, timestamp, text, integer, boolean } from 'drizzle-orm/pg-core'

export const imagesGenerator = pgTable('images_generator', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  user_email: text('user_email').notNull(),
  request_id: text('request_id').notNull(),
  prompt: text('prompt').notNull(),
  logo: text('logo'),
  result: text('result'),
  result_with_logo: text('result_with_logo'),
  tokens: integer('tokens').default(0).notNull()
})

export const telegramMembers = pgTable('telegram_members', {
  user_id: bigserial('user_id', { mode: 'number' }).primaryKey(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name'),
  username: text('username'),
  joined_at: timestamp('joined_at', { withTimezone: false }).defaultNow(),
  is_active: boolean('is_active').default(true)
})

export const telegramWinners = pgTable('telegram_winners', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  user_id: bigserial('user_id', { mode: 'number' }).notNull(),
  first_name: text('first_name').notNull(),
  username: text('username'),
  won_at: timestamp('won_at', { withTimezone: false }).defaultNow(),
  message: text('message')
})

export type ImagesGenerator = typeof imagesGenerator.$inferSelect
export type NewImagesGenerator = typeof imagesGenerator.$inferInsert
export type TelegramMember = typeof telegramMembers.$inferSelect
export type NewTelegramMember = typeof telegramMembers.$inferInsert
export type TelegramWinner = typeof telegramWinners.$inferSelect
export type NewTelegramWinner = typeof telegramWinners.$inferInsert

export const automaticPrompts = pgTable('automatic_prompts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('general').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  order_index: integer('order_index').default(0).notNull()
})

export type AutomaticPrompt = typeof automaticPrompts.$inferSelect
export type NewAutomaticPrompt = typeof automaticPrompts.$inferInsert
