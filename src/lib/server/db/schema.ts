import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	displayName: text('display_name').notNull(),
	isAdmin: boolean('is_admin').notNull().default(false)
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;

export const tetsudoSquares = pgTable('tetsudo_squares', {
	id: text('id').primaryKey(),
	type: text('type').notNull(), // 'blue', 'red', 'property', 'card', 'start'
	name: text('name'),
	x: integer('x').notNull(),
	y: integer('y').notNull(),
	metadata: text('metadata')
});

export const tetsudoPaths = pgTable('tetsudo_paths', {
	id: text('id').primaryKey(),
	square1Id: text('square1_id')
		.notNull()
		.references(() => tetsudoSquares.id),
	square2Id: text('square2_id')
		.notNull()
		.references(() => tetsudoSquares.id)
});

export type TetsudoSquare = typeof tetsudoSquares.$inferSelect;
export type TetsudoPath = typeof tetsudoPaths.$inferSelect;
