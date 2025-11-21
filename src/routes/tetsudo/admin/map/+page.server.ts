import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tetsudoSquares, tetsudoPaths, tetsudoProperties } from '$lib/server/db/schema';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
	if (!locals.user.isAdmin) {
		throw error(403, 'Forbidden');
	}

	const squares = await db.select().from(tetsudoSquares);
	const paths = await db.select().from(tetsudoPaths);
	const properties = await db.select().from(tetsudoProperties);

	return {
		squares,
		paths,
		properties
	};
};
