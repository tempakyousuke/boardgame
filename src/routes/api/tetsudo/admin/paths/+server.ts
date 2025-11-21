import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tetsudoPaths } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, locals }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const data = await request.json();
	await db.insert(tetsudoPaths).values(data).onConflictDoUpdate({
		target: tetsudoPaths.id,
		set: data
	});

	return json({ success: true });
};

export const DELETE = async ({ request, locals }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { id } = await request.json();
	await db.delete(tetsudoPaths).where(eq(tetsudoPaths.id, id));

	return json({ success: true });
};
