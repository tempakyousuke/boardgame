import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { tetsudoProperties } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST = async ({ request, locals }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const data = await request.json();
	await db.insert(tetsudoProperties).values(data).onConflictDoUpdate({
		target: tetsudoProperties.id,
		set: data
	});

	return json({ success: true });
};

export const DELETE = async ({ request, locals }) => {
	if (!locals.user?.isAdmin) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const { id } = await request.json();
	await db.delete(tetsudoProperties).where(eq(tetsudoProperties.id, id));

	return json({ success: true });
};
