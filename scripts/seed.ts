import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { hash } from '@node-rs/argon2';
import * as schema from '../src/lib/server/db/schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
	console.log('Seeding database...');

	const passwordHash = await hash('test123', {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});

	await db
		.insert(schema.user)
		.values({
			id: crypto.randomUUID(),
			username: 'tempakyousuke',
			displayName: 'てんぱ',
			passwordHash,
			isAdmin: true
		})
		.onConflictDoNothing();

	console.log('Seed completed!');
	process.exit(0);
}

seed().catch((e) => {
	console.error('Seed failed:', e);
	process.exit(1);
});
