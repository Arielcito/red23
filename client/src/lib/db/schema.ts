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

export const userReferrals = pgTable('user_referrals', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  user_id: text('user_id').notNull(),
  referral_code: text('referral_code').notNull().unique(),
  referred_by_code: text('referred_by_code'),
  referred_by_user_id: text('referred_by_user_id'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
})

export const referralTracking = pgTable('referral_tracking', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  referrer_user_id: text('referrer_user_id').notNull(),
  referred_user_id: text('referred_user_id').notNull(),
  referral_code: text('referral_code').notNull(),
  status: text('status').default('pending').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  completed_at: timestamp('completed_at', { withTimezone: true })
})

export type UserReferral = typeof userReferrals.$inferSelect
export type NewUserReferral = typeof userReferrals.$inferInsert
export type ReferralTracking = typeof referralTracking.$inferSelect
export type NewReferralTracking = typeof referralTracking.$inferInsert
